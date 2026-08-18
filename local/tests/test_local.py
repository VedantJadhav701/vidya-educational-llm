import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
sys.path.insert(0, r"C:\Users\HP\projects\Vidya-1.7B\local")
from app import generate_response

print("Testing generate_response directly...")
try:
    for chunk in generate_response("What is photosynthesis?", []):
        print(chunk, end="", flush=True)
    print("\nSUCCESS!")
except Exception as e:
    import traceback
    traceback.print_exc()
