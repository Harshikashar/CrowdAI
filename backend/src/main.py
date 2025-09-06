import cv2
import numpy as np
from ultralytics import YOLO

def main():
    # Initialize YOLO model
    model = YOLO('yolov8n.pt')
    
    # Initialize video capture
    cap = cv2.VideoCapture(0)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Settings
    threshold = 10  # High density threshold
    positions = []  # Store positions for heatmap
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Detect people in the frame
        results = model(frame, classes=0)  # Class 0 is person in COCO dataset
        boxes = results[0].boxes
        person_count = len(boxes)
        
        # Get positions of detected people for heatmap
        current_positions = []
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)
            current_positions.append((cx, cy))
            positions.append((cx, cy))
        
        # Determine crowd density level
        if person_count > threshold:
            density_level = "high"
            print("⚠️ High Crowd Density Detected!")
        elif 5 <= person_count <= threshold:
            density_level = "moderate"
            print("⚠️ Moderate Crowd")
        else:
            density_level = "low"
            print("✅ Low Crowd")
        
        # Create heatmap visualization
        visualized_frame = create_heatmap_visualization(
            frame, 
            current_positions, 
            density_level, 
            person_count, 
            width, 
            height
        )
        
        # Show the visualization
        cv2.imshow('Real-Time Crowd Detection', visualized_frame)
        
        # Break loop on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Clean up
    cap.release()
    cv2.destroyAllWindows()

def create_heatmap_visualization(frame, positions, density_level, person_count, width, height):
    """Creates a heatmap visualization with modern design similar to React component."""
    # Create a blank RGBA image for the gradient overlay
    gradient = np.zeros((height, width, 4), dtype=np.uint8)
    center_x, center_y = width // 2, height // 2
    
    # Define colors based on density level (RGBA format)
    if density_level == "high":
        inner_color = (68, 68, 239, 204)  # Red with opacity
    elif density_level == "moderate":
        inner_color = (11, 158, 245, 179)  # Amber with opacity
    else:
        inner_color = (94, 197, 34, 153)  # Green with opacity
    
    # Create radial gradient (from center outward)
    max_radius = int(np.sqrt(width**2 + height**2) / 2)
    
    for y in range(height):
        for x in range(width):
            # Calculate distance from center
            distance = np.sqrt((x - center_x)**2 + (y - center_y)**2)
            if distance <= max_radius:
                # Calculate opacity based on distance
                opacity = max(0, 1 - (distance / max_radius))
                # Apply color with opacity
                gradient[y, x] = (
                    inner_color[0], 
                    inner_color[1], 
                    inner_color[2], 
                    int(inner_color[3] * opacity)
                )
    
    # Add white dots to represent people
    for x, y in positions:
        if 0 <= x < width and 0 <= y < height:
            # Draw a small white circle for each person
            cv2.circle(gradient, (int(x), int(y)), 3, (255, 255, 255, 200), -1)
    
    # Convert RGBA to BGR for OpenCV
    # First convert to RGB by dropping alpha
    rgb = gradient[:, :, :3].copy()
    # Then convert RGB to BGR
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    
    # Create a mask from the alpha channel
    alpha = gradient[:, :, 3].astype(float) / 255.0
    
    # Expand dimensions for broadcasting
    alpha = np.expand_dims(alpha, axis=2)
    
    # Blend using the alpha mask
    blended = cv2.addWeighted(
        frame, 1.0, 
        bgr, 0.7, 
        0
    )
    
    # Add density level indicators at the bottom
    indicator_y = height - 30
    
    # Low density indicator
    cv2.circle(blended, (50, indicator_y), 5, (34, 197, 94), -1)  # Green
    cv2.putText(blended, "Low (0-30%)", (60, indicator_y + 5), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    # Moderate density indicator
    cv2.circle(blended, (200, indicator_y), 5, (11, 158, 245), -1)  # Amber
    cv2.putText(blended, "Moderate (30-70%)", (210, indicator_y + 5), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    # High density indicator
    cv2.circle(blended, (380, indicator_y), 5, (68, 68, 239), -1)  # Red
    cv2.putText(blended, "High (70-100%)", (390, indicator_y + 5), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    # Add current density level and people count
    cv2.putText(blended, f"People Count: {person_count}", (10, 30), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    # Add an alert box for density level
    alert_x, alert_y = width - 200, 20
    alert_width, alert_height = 190, 40
    
    if density_level == "high":
        alert_color = (68, 68, 239)  # Red
        alert_text = "HIGH DENSITY"
    elif density_level == "moderate":
        alert_color = (11, 158, 245)  # Amber
        alert_text = "MODERATE DENSITY"
    else:
        alert_color = (94, 197, 34)  # Green
        alert_text = "LOW DENSITY"
    
    # Draw alert box with rounded corners
    cv2.rectangle(blended, (alert_x, alert_y), (alert_x + alert_width, alert_y + alert_height), 
                 alert_color, -1)
    cv2.putText(blended, alert_text, (alert_x + 10, alert_y + 27), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    return blended

if __name__ == "__main__":
    main()

