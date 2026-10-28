
# Import Flask so Python can create a web application.
from flask import Flask ,render_template

# Create our KharchWise application.
app = Flask(__name__)


# Define the home page route.
# When someone visits the root URL, Flask will show this page.
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register")
def register():
    return render_template("register.html")


# Start the development server when this file is executed directly.
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
