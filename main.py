import sys
import os

# Dynamically append the backend folder to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

# Import the operational application instance from your backend folder
from backend.app import app