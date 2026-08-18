import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
sys.path.insert(0, r"C:\Users\HP\projects\Vidya-1.7B\local")
from app import generate_response

print("Starting generation test...")
result = generate_response("What is 2+2?", [])
print("\n=== RESULT ===")
print(result)
print("=== END ===")
