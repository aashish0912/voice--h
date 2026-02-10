const fs = require('fs');
const path = require('path');

// Configuration
const VAPI_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE'; // User would replace this
const ASSISTANT_ID = 'YOUR_ASSISTANT_ID_HERE';   // User would replace this

// Mock input (in a real CLI, this would be an argument)
const TARGET_URL = process.argv[2] || 'https://voicehelden.nl';

console.log(`Generating demo for: ${TARGET_URL}`);

// Template for the demo site
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voice AI Demo for ${TARGET_URL}</title>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; }
        header { background: #333; color: white; padding: 1rem; text-align: center; }
        .container { max-width: 800px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        p { line-height: 1.6; }
        .iframe-container { border: 1px solid #ddd; height: 500px; margin-top: 20px; }
    </style>
</head>
<body>

<header>
    <h1>Voice AI Assistant Demo</h1>
</header>

<div class="container">
    <h2>Demo for ${TARGET_URL}</h2>
    <p>This is a generated demo site reflecting the target brand. The voice assistant is active below.</p>
    
    <!-- In a real scraper, we might embed the target site in an iframe or scrape its content -->
    <div class="iframe-container">
        <iframe src="${TARGET_URL}" width="100%" height="100%" frameborder="0"></iframe>
    </div>
</div>

<!-- Vapi Snippet -->
<script>
  var vapiInstance = null;
  const assistantId = "${ASSISTANT_ID}"; 
  const apiKey = "${VAPI_PUBLIC_KEY}"; 
  const buttonConfig = {
    position: "bottom-right", 
    offset: "40px", 
    width: "50px", 
    height: "50px", 
    idle: { // Button state when not active
      color: "rgb(93, 254, 202)", 
      type: "pill", 
      title: "Talk to us", 
      subtitle: "AI Assistant", 
      icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone.svg", 
    },
    active: { // Button state when call is active
      color: "rgb(255, 0, 0)", 
      type: "pill", 
      title: "Call in progress...", 
      subtitle: "End Call", 
      icon: "https://unpkg.com/lucide-static@0.321.0/icons/phone-off.svg", 
    },
  };

  (function(d, t) {
    var g = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
    g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);

    g.onload = function() {
      vapiInstance = window.vapiSDK.run({
        apiKey: apiKey, 
        assistant: assistantId, 
        config: buttonConfig, 
      });
    };
  })(document, "script");
</script>

</body>
</html>
`;

// Output Directory
const outputDir = path.join(__dirname, 'demo_build');
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

// Write the file
const outputPath = path.join(outputDir, 'index.html');
fs.writeFileSync(outputPath, htmlTemplate);

console.log(`Demo site created at: ${outputPath}`);
console.log('To deploy, you would simply upload the "demo_build" folder to Netlify/Vercel via their CLI.');
