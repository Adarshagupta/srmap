# Use a pipeline as a high-level helper
from transformers import pipeline

pipe = pipeline("text-classification", model="Qwen/Qwen2.5-Math-RM-72B", trust_remote_code=True)