from flask import Flask, request, jsonify, send_from_directory, send_file
from duckduckgo_search import DDGS
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application
import io
import os
import requests
import urllib.parse
import re
import webbrowser
import threading
import time

app = Flask(__name__, static_folder='.', static_url_path='')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/image', methods=['GET'])
def get_image():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    try:
        # 1. Try Wikipedia API (Best for educational topics, no rate limits)
        wiki_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(query.title())}"
        headers = {'User-Agent': 'VidyaEducationalApp/1.0'}
        response = requests.get(wiki_url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if 'originalimage' in data:
                return jsonify({"url": data['originalimage']['source'], "title": data.get('title', query)})
            elif 'thumbnail' in data:
                return jsonify({"url": data['thumbnail']['source'], "title": data.get('title', query)})
        
        # 2. Fallback to DuckDuckGo if Wikipedia doesn't have an image
        ddgs = DDGS()
        results = ddgs.images(query, max_results=1)
        if results:
            return jsonify({"url": results[0]['image'], "title": results[0].get('title', query)})
            
        return jsonify({"error": "No image found"}), 404
    except Exception as e:
        print(f"Image search error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/graph', methods=['GET'])
def get_graph():
    expr_str = request.args.get('expr')
    if not expr_str:
        return jsonify({"error": "No expression provided"}), 400
    
    try:
        x = sp.Symbol('x')
        plt.figure(figsize=(6, 4), facecolor='#1e293b')
        ax = plt.gca()
        ax.set_facecolor('#0f172a')
        
        raw_exprs = [e.strip() for e in expr_str.split(',')]
        x_vals = np.linspace(-10, 10, 400)
        colors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        
        for i, raw_expr in enumerate(raw_exprs):
            clean_expr = raw_expr.replace('^', '**').strip().lower()
            clean_expr = re.sub(r'(sin|cos|tan|log|exp)\s+([a-zA-Z0-9\.]+)', r'\1(\2)', clean_expr)
            if clean_expr in ['sin', 'cos', 'tan', 'exp', 'log']:
                clean_expr = f"{clean_expr}(x)"
                
            is_vertical = False
            v_val = 0
            if '=' in clean_expr:
                parts = [p.strip() for p in clean_expr.split('=', 1)]
                if parts[0] == 'y' or ('(' in parts[0] and ')' in parts[0] and 'x' in parts[0]):
                    clean_expr = parts[1]
                elif parts[1] == 'y' or ('(' in parts[1] and ')' in parts[1] and 'x' in parts[1]):
                    clean_expr = parts[0]
                elif parts[0] == 'x':
                    transformations = standard_transformations + (implicit_multiplication_application,)
                    v_val = float(parse_expr(parts[1], transformations=transformations))
                    is_vertical = True
                elif parts[1] == 'x':
                    transformations = standard_transformations + (implicit_multiplication_application,)
                    v_val = float(parse_expr(parts[0], transformations=transformations))
                    is_vertical = True
                    
            c = colors[i % len(colors)]
            if is_vertical:
                plt.axvline(v_val, color=c, linewidth=2.5, label=raw_expr)
            else:
                transformations = standard_transformations + (implicit_multiplication_application,)
                expr = parse_expr(clean_expr, transformations=transformations)
                f = sp.lambdify(x, expr, 'numpy')
                y_vals = f(x_vals)
                if isinstance(y_vals, (int, float)) or getattr(y_vals, 'shape', None) == ():
                    y_vals = np.full_like(x_vals, float(y_vals))
                plt.plot(x_vals, y_vals, color=c, linewidth=2.5, label=raw_expr)
                
        # Force square-ish view limits if it's autoscaled too small
        curr_xlim = ax.get_xlim()
        curr_ylim = ax.get_ylim()
        ax.set_xlim(min(-10, curr_xlim[0]), max(10, curr_xlim[1]))
        ax.set_ylim(min(-10, curr_ylim[0]), max(10, curr_ylim[1]))
        
        plt.grid(True, color='white', alpha=0.1, linestyle='--')
        plt.axhline(0, color='white', linewidth=0.5)
        plt.axvline(0, color='white', linewidth=0.5)
        
        ax.tick_params(colors='white')
        for spine in ax.spines.values():
            spine.set_color('white')
            spine.set_alpha(0.2)
            
        if len(raw_exprs) > 1:
            plt.legend(facecolor='#0f172a', edgecolor='white', labelcolor='white')
            
        plt.title(f'Graph of: {expr_str}', color='white', pad=15)
        
        # Save to buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', facecolor='#1e293b', dpi=150)
        buf.seek(0)
        plt.close()
        
        return send_file(buf, mimetype='image/png')
    except Exception as e:
        plt.close()
        print(f"Graphing error: {str(e)}")
        return jsonify({"error": str(e)}), 400

def open_browser():
    time.sleep(1.5)
    webbrowser.open("http://localhost:5000")

if __name__ == '__main__':
    print("Starting Vidya 1.7B Educational Server on http://localhost:5000")
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        threading.Thread(target=open_browser, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=True)
