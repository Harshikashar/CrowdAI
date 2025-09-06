'''import cv2
from ultralytics import YOLO
import time

# Load the YOLOv8 model (choose the appropriate model file such as yolov8n.pt, yolov8s.pt, etc.)
model = YOLO('yolov8n.pt')  # You can use yolov8s.pt, yolov8m.pt, etc. based on the required accuracy and speed

# Start the video capture (0 is for the default webcam)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not access the camera.")
    exit()

# Set frame width and height for better resolution
cap.set(3, 640)  # Width
cap.set(4, 480)  # Height

# Loop for real-time detection
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Perform inference on the frame
    results = model(frame)

    # Draw the results (bounding boxes and labels) on the frame
    results.render()  # Draw the results on the frame
    
    # Display the frame with detections
    cv2.imshow('YOLOv8 Real-Time Detection', frame)

    # Press 'q' to quit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close any open windows
cap.release()
cv2.destroyAllWindows()'''


'''import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from ultralytics import YOLO
import subprocess

class WebcamCrowdDetector:
    def __init__(self, model_path='yolov8n.pt', threshold=10):
        self.model = YOLO('yolov8n.pt')
        self.person_counts = []     # For line graph
        self.frame_count = []       # For X-axis of graph
        self.threshold = threshold
        self.positions = []         # For spatial heatmap
        self.cap = None             # To hold webcam capture instance

    def play_alert_sound(self):
        try:
            subprocess.run(["afplay", "alert.mp3"])  # macOS only
        except Exception as e:
            print(f"Sound Error: {e}")

    def open_camera(self):
        """ Function to open webcam feed """
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            print("Error: Could not open webcam.")
            return False
        return True

    def close_camera(self):
        """ Function to close the webcam feed properly """
        if self.cap is not None:
            self.cap.release()
        cv2.destroyAllWindows()

    def start_real_time_detection(self):
        """ Starts the real-time crowd detection. """
        if not self.open_camera():  # Try to open the webcam
            return  # If webcam failed to open, exit

        frame_no = 0

        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    break

                # Run the YOLO model for detection
                results = self.model(frame, classes=0)
                boxes = results[0].boxes
                person_count = len(boxes)

                self.person_counts.append(person_count)
                self.frame_count.append(frame_no)
                frame_no += 1

                # ✅ Extract center positions for heatmap
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    cx = int((x1 + x2) / 2)
                    cy = int((y1 + y2) / 2)
                    self.positions.append((cx, cy))

                # 🔔 Optional alert if threshold exceeded
                if person_count > self.threshold:
                    print("⚠️ High Crowd Density Detected!")
                    self.play_alert_sound()

                # Show the annotated frame (with detected boxes)
                annotated_frame = results[0].plot()
                cv2.imshow('Real-Time Crowd Detection', annotated_frame)

                # Stop if 'q' is pressed
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        finally:
            # Ensure camera is released and any open windows are closed
            self.close_camera()
            



def main():
    detector = WebcamCrowdDetector()
    print("📷 Starting real-time crowd detection... Press 'q' to stop.")
    detector.start_real_time_detection()

if __name__ == "__main__":
    main()
'''
'''import cv2
from ultralytics import YOLO
import subprocess

class WebcamCrowdDetector:
    def __init__(self, model_path='yolov8n.pt', threshold=10):
        self.model = YOLO(model_path)
        self.person_counts = []     # For line graph
        self.frame_count = []       # For X-axis of graph
        self.threshold = threshold
        self.positions = []         # For spatial heatmap
        self.cap = None             # To hold webcam capture instance
        self.latest_frame = None    # To store the latest frame for streaming

    def play_alert_sound(self):
        try:
            subprocess.run(["afplay", "alert.mp3"])  # macOS only
        except Exception as e:
            print(f"Sound Error: {e}")

    def open_camera(self):
        """ Function to open webcam feed """
        self.cap = cv2.VideoCapture(0)  # Ensure this opens the live camera feed
        if not self.cap.isOpened():
            print("Error: Could not open webcam.")
            return False
        return True

    def close_camera(self):
        """ Function to close the webcam feed properly """
        if self.cap is not None:
            self.cap.release()
        cv2.destroyAllWindows()

    def get_latest_frame(self):
        """ Return the latest frame captured for streaming """
        return self.latest_frame

    def start_real_time_detection(self):
        """ Starts the real-time crowd detection. """
        if not self.open_camera():  # Try to open the webcam
            return  # If webcam failed to open, exit

        frame_no = 0

        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    break

                # Run the YOLO model for detection
                results = self.model(frame, classes=0)
                boxes = results[0].boxes
                person_count = len(boxes)

                self.person_counts.append(person_count)
                self.frame_count.append(frame_no)
                frame_no += 1

                # ✅ Extract center positions for heatmap
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    cx = int((x1 + x2) / 2)
                    cy = int((y1 + y2) / 2)
                    self.positions.append((cx, cy))

                # Store the latest frame to be used for streaming
                self.latest_frame = frame

                # 🔔 Optional alert if threshold exceeded
                if person_count > self.threshold:
                    print("⚠️ High Crowd Density Detected!")
                    self.play_alert_sound()

                # Stop if 'q' is pressed
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        finally:
            # Ensure camera is released and any open windows are closed
            self.close_camera()'''

'''from flask import Flask, jsonify
from threading import Thread
import cv2
from ultralytics import YOLO

app = Flask(__name__)
model = YOLO('yolov8n.pt')  # Your model path
person_count = 0  # Shared variable to store person count

def detect_people():
    global person_count
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Webcam not accessible.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame, classes=0)
        boxes = results[0].boxes
        person_count = len(boxes)

        # You can remove imshow if not needed
        annotated_frame = results[0].plot()
        cv2.imshow('Real-Time Crowd Detection', annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

@app.route('/count')
def get_count():
    return jsonify({"person_count": person_count})

if __name__ == '__main__':
    # Run detection in a background thread
    thread = Thread(target=detect_people, daemon=True)
    thread.start()
    app.run(host='0.0.0.0', port=5001)'''

'''from flask import Flask, jsonify
from threading import Thread
import cv2
from ultralytics import YOLO
import queue

app = Flask(__name__)
model = YOLO('yolov8n.pt')  # Your model path
person_count = 0  # Shared variable to store person count
frame_queue = queue.Queue()  # Queue to pass frames from the detection thread to the main thread

def detect_people():
    global person_count
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Webcam not accessible.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Perform detection
        results = model(frame, classes=0)
        boxes = results[0].boxes
        person_count = len(boxes)  # Update the person count

        # Send the frame to the main thread for display
        annotated_frame = results[0].plot()
        frame_queue.put(annotated_frame)

        # Delay to control the frame rate
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

@app.route('/count')
def get_count():
    return jsonify({"person_count": person_count})

def display_frame():
    while True:
        if not frame_queue.empty():
            frame = frame_queue.get()
            cv2.imshow('Real-Time Crowd Detection', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cv2.destroyAllWindows()

if __name__ == '__main__':
    # Start the detection thread
    detection_thread = Thread(target=detect_people, daemon=True)
    detection_thread.start()

    # Start the display thread to show the frame from the queue
    display_thread = Thread(target=display_frame, daemon=True)
    display_thread.start()

    # Run Flask app
    app.run(host='0.0.0.0', port=5001)
'''
'''import cv2
import sys
from ultralytics import YOLO

# Get the location from command-line arguments
location = sys.argv[1] if len(sys.argv) > 1 else "Unknown Location"
print(f"Starting webcam detection for location: {location}")

# Load the YOLO model
model = YOLO('yolov8n.pt')  # Path to your YOLOv8 model

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Webcam not accessible.")
    sys.exit(1)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, classes=0)  # Detect people (class 0)
    boxes = results[0].boxes

    # Annotating the frame with detections
    annotated_frame = results[0].plot()
    cv2.imshow('Real-Time Crowd Detection', annotated_frame)

    # Press 'q' to exit the webcam feed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()'''

'''import cv2
from ultralytics import YOLO
import queue
from flask import Flask, jsonify
from threading import Thread
person_count = 0  # Shared variable to store person count
frame_queue = queue.Queue() 
def start_detection(location="Dashboard"):
    print(f"📍 Starting webcam detection ")

    model = YOLO('yolov8n.pt')  # Use your YOLO model path

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Webcam not accessible.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Perform detection
        results = model(frame, classes=0)
        boxes = results[0].boxes
        person_count = len(boxes)  # Update the person count

        # Send the frame to the main thread for display
        annotated_frame = results[0].plot()
        frame_queue.put(annotated_frame)

        # Delay to control the frame rate
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()'''

'''import cv2
from ultralytics import YOLO

# Load the YOLO model
model = YOLO('yolov8n.pt')  # Path to your YOLOv8 model

# Global variable to store person count
person_count = 0

def start_detection():
    global person_count
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Webcam not accessible.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Perform detection using YOLO model
        results = model(frame, classes=0)  # Detect people (class 0)
        boxes = results[0].boxes  # The bounding boxes of detected persons

        # Update the person count
        person_count = len(boxes)

        # Annotate the frame with detected people
        annotated_frame = results[0].plot()

        # Show the frame with detections
        cv2.imshow('Real-Time Crowd Detection', annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def get_person_count():
    return person_count'''

'''import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from ultralytics import YOLO
import subprocess

# ✅ realtime_detection.py ke neeche yeh add karo:



class WebcamCrowdDetector:
    def __init__(self, model_path='yolov8n.pt', threshold=10):
        self.model = YOLO(model_path)
        self.person_counts = []     # For line graph
        self.frame_count = []       # For X-axis of graph
        self.threshold = threshold
        self.positions = []         # For spatial heatmap

    def play_alert_sound(self):
        try:
            subprocess.run(["afplay", "alert.mp3"])  # macOS only
        except Exception as e:
            print(f"Sound Error: {e}")

    def start_real_time_detection(self):
        cap = cv2.VideoCapture(0)

        if not cap.isOpened():
            print("Error: Could not open webcam.")
            return

        frame_no = 0

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                results = self.model(frame, classes=0)
                boxes = results[0].boxes
                person_count = len(boxes)

                self.person_counts.append(person_count)
                self.frame_count.append(frame_no)
                frame_no += 1

                # ✅ Extract center positions for heatmap
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    cx = int((x1 + x2) / 2)
                    cy = int((y1 + y2) / 2)
                    self.positions.append((cx, cy))
                
                # 🔔 Optional alert
                if person_count > self.threshold:
                    print("⚠️ High Crowd Density Detected!")

                # Show annotated frame
                annotated_frame = results[0].plot()
                cv2.imshow('Real-Time Crowd Detection', annotated_frame)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        finally:
            cap.release()
            cv2.destroyAllWindows()
            self.plot_crowd_trend()
            self.generate_spatial_heatmap()
    
    

    def generate_spatial_heatmap(self):
        """ 🔥 Spatial Heatmap from person center positions """
        if not self.positions:
            print("No position data available.")
            return

        # Extract x and y positions
        x_coords = [pos[0] for pos in self.positions]
        y_coords = [pos[1] for pos in self.positions]

        heatmap, xedges, yedges = np.histogram2d(x_coords, y_coords, bins=(64, 48), range=[[0, 640], [0, 480]])

        # Transpose heatmap to match image orientation
        heatmap = np.rot90(heatmap)

        total_people = self.person_counts[-1] if self.person_counts else 0
        

        plt.figure(figsize=(8, 5))
        plt.imshow(heatmap, cmap='jet', interpolation='nearest')
        plt.colorbar(label='Crowd Density')
        plt.text(10, 5, f"People Detected: {total_people}", fontsize=12, color='white',
             bbox=dict(facecolor='black', alpha=0.6))
       
        plt.title("Spatial Crowd Density Heatmap")
        plt.axis('off')
        plt.tight_layout()
        plt.savefig("crowd_heatmap.png")
        plt.show()


    _detector_instance = None  # Singleton-style instance

    def start_detection():
        global _detector_instance
        if _detector_instance is None:
            _detector_instance = WebcamCrowdDetector()
        _detector_instance.start_real_time_detection()

    def get_person_count():
        global _detector_instance
        if _detector_instance and _detector_instance.person_counts:
            return _detector_instance.person_counts[-1]
        return 0
    def generate_spatial_heatmap(self):
        """ 🔥 Spatial Heatmap from person center positions """
        if not self.positions:
            print("No position data available.")
            return

    # Extract x and y positions
        x_coords = [pos[0] for pos in self.positions]
        y_coords = [pos[1] for pos in self.positions]

        heatmap, xedges, yedges = np.histogram2d(
            x_coords, y_coords,
            bins=(64, 48),
            range=[[0, 640], [0, 480]]
    )

    # Transpose heatmap to match image orientation
        heatmap = np.rot90(heatmap)

    # 📊 Calculate actual range for color scaling
        min_val = np.min(heatmap)
        max_val = np.max(heatmap)
        print(f"Heatmap min: {min_val}, max: {max_val}")


    # ✅ Plot with better scaling
        plt.figure(figsize=(8, 5))
        plt.imshow(heatmap, cmap='jet', interpolation='nearest', vmin=min_val, vmax=max_val if max_val > 0 else 1)
        plt.colorbar(label='Crowd Density')
        plt.title("Spatial Crowd Density Heatmap")
        plt.axis('off')
        plt.tight_layout()
        plt.savefig("crowd_heatmap.png")
        plt.show()
    
    




def main():
    detector = WebcamCrowdDetector()
    print("📷 Starting real-time crowd detection... Press 'q' to stop.")
    detector.start_real_time_detection()

if __name__ == "__main__":
    main()'''

'''import cv2
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from ultralytics import YOLO
import threading

# Global control flag
keep_running = True

class WebcamCrowdDetector:
    def __init__(self, model_path='yolov8n.pt', threshold=10):
        self.model = YOLO(model_path)
        self.person_counts = []
        self.frame_count = []
        self.threshold = threshold
        self.positions = []

    def start_real_time_detection(self):
        global keep_running
        keep_running = True  # Reset on start

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Error: Could not open webcam.")
            return

        frame_no = 0

        try:
            while keep_running:
                ret, frame = cap.read()
                if not ret:
                    break

                results = self.model(frame, classes=0)
                boxes = results[0].boxes
                person_count = len(boxes)

                self.person_counts.append(person_count)
                self.frame_count.append(frame_no)
                frame_no += 1

                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    cx = int((x1 + x2) / 2)
                    cy = int((y1 + y2) / 2)
                    self.positions.append((cx, cy))

                if person_count > self.threshold:
                    print("⚠️ High Crowd Density Detected!")

                annotated_frame = results[0].plot()
                cv2.imshow('Real-Time Crowd Detection', annotated_frame)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        finally:
            cap.release()
            cv2.destroyAllWindows()
            self.plot_crowd_trend()
            self.generate_spatial_heatmap()

    def stop_detection(self):
        global keep_running
        keep_running = False

    def plot_crowd_trend(self):
        plt.figure(figsize=(10, 5))
        plt.plot(self.frame_count, self.person_counts, marker='o', linestyle='-')
        plt.xlabel("Frame Number")
        plt.ylabel("Person Count")
        plt.title("Person Count Over Time")
        plt.grid(True)
        plt.savefig("crowd_trend.png")

    def generate_spatial_heatmap(self):
        if not self.positions:
            print("No position data available.")
            return

        x_coords = [pos[0] for pos in self.positions]
        y_coords = [pos[1] for pos in self.positions]

        heatmap, xedges, yedges = np.histogram2d(x_coords, y_coords, bins=(64, 48), range=[[0, 640], [0, 480]])
        heatmap = np.rot90(heatmap)

        total_people = self.person_counts[-1] if self.person_counts else 0

        plt.figure(figsize=(8, 5))
        plt.imshow(heatmap, cmap='jet', interpolation='nearest')
        plt.colorbar(label='Crowd Density')
        plt.text(10, 5, f"People Detected: {total_people}", fontsize=12, color='white',
                 bbox=dict(facecolor='black', alpha=0.6))
        plt.title("Spatial Crowd Density Heatmap")
        plt.axis('off')
        plt.tight_layout()
        plt.savefig("crowd_heatmap.png")


# Singleton-style control
_detector_instance = None

def start_real_time_detection():
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = WebcamCrowdDetector()
    _detector_instance.start_real_time_detection()

def stop_real_time_detection():
    global _detector_instance
    if _detector_instance:
        _detector_instance.stop_detection()

def get_person_count():
    global _detector_instance
    if _detector_instance and _detector_instance.person_counts:
        return _detector_instance.person_counts[-1]
    return 0'''


'''import cv2
import numpy as np
from ultralytics import YOLO
import sys
import matplotlib.pyplot as plt
import os

class WebcamCrowdDetector:
    def __init__(self, model_path='yolov8n.pt', threshold=10):
        self.model = YOLO(model_path)
        self.threshold = threshold
        self.positions = []
        self.person_count = 0

    def generate_heatmap(self, image_shape, output_path='heatmap.png'):
        if not self.positions:
            print("No position data available.")
            return

        x_coords = [pos[0] for pos in self.positions]
        y_coords = [pos[1] for pos in self.positions]

        heatmap, xedges, yedges = np.histogram2d(x_coords, y_coords, bins=(64, 48), range=[[0, image_shape[1]], [0, image_shape[0]]])
        heatmap = np.rot90(heatmap)

        plt.figure(figsize=(8, 5))
        plt.imshow(heatmap, cmap='jet', interpolation='nearest')
        plt.colorbar(label='Crowd Density')
        plt.axis('off')
        plt.tight_layout()
        plt.savefig(output_path)
        print(f"✅ Heatmap saved as {output_path}")

    def start_detection(self):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Error: Could not open webcam.")
            return

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                results = self.model(frame, classes=0)
                boxes = results[0].boxes
                self.person_count = len(boxes)

                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    cx = int((x1 + x2) / 2)
                    cy = int((y1 + y2) / 2)
                    self.positions.append((cx, cy))

                # Alert messages
                if self.person_count > self.threshold:
                    alert = "⚠️ High Crowd Detected"
                elif 5 < self.person_count <= self.threshold:
                    alert = "⚠️ Moderate Crowd Detected"
                else:
                    alert = "✅ Low Crowd"

                print(f"👥 Persons: {self.person_count} | {alert}")

                annotated_frame = results[0].plot()
                cv2.imshow("Crowd Detection", annotated_frame)

                # Press q to stop
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    image_path = 'captured_frame.jpg'
                    cv2.imwrite(image_path, frame)
                    print(f"📸 Frame saved as {image_path}")
                    self.generate_heatmap(frame.shape)
                    break

        finally:
            cap.release()
            cv2.destroyAllWindows()

if __name__ == '__main__':
    detector = WebcamCrowdDetector()
    detector.start_detection()'''

import cv2
import numpy as np
from ultralytics import YOLO
import matplotlib.pyplot as plt
import seaborn as sns

model = YOLO('yolov8n.pt')  # Lightweight YOLOv8
person_counts = []
positions = []

cap = cv2.VideoCapture(0)

frame_no = 0
threshold = 10

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, classes=0)
    boxes = results[0].boxes
    person_count = len(boxes)
    person_counts.append(person_count)

    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        cx = int((x1 + x2) / 2)
        cy = int((y1 + y2) / 2)
        positions.append((cx, cy))

    if person_count > threshold:
        print("⚠️ High Crowd Density Detected!")
    elif 5 <= person_count <= threshold:
        print("⚠️ Moderate Crowd")
    else:
        print("✅ Low Crowd")

    annotated_frame = results[0].plot()
    cv2.imshow('Real-Time Crowd Detection', annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        cv2.imwrite("captured_frame.jpg", frame)
        print("📸 Frame captured as 'captured_frame.jpg'")
        break

cap.release()
cv2.destroyAllWindows()

# 🔥 Generate Heatmap After Closing
if positions:
    x_coords = [p[0] for p in positions]
    y_coords = [p[1] for p in positions]
    heatmap, _, _ = np.histogram2d(x_coords, y_coords, bins=(64, 48), range=[[0, 640], [0, 480]])
    heatmap = np.rot90(heatmap)

    plt.figure(figsize=(8, 5))
    plt.imshow(heatmap, cmap='jet', interpolation='nearest')
    plt.colorbar(label='Crowd Density')
    plt.title("Spatial Crowd Density Heatmap")
    plt.axis('off')
    plt.tight_layout()
    plt.savefig("heatmap.png")
    print("🌡️ Heatmap saved as 'heatmap.png'")
else:
    print("No positions to create heatmap.")
