from flask import Flask, request, jsonify
import yt_dlp

app = Flask(__name__)

def generate_audio(url):
    """
    Given a YouTube URL, return the direct audio stream URL.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'noplaylist': True,
        'extractor_args': {'youtube': {'player_client': ['android']}},
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

        if 'url' in info:
            return info['url']

        if 'formats' in info:
            for f in info['formats']:
                if f.get('acodec') != 'none' and 'url' in f:
                    return f['url']

        raise Exception("No valid audio stream URL found. YouTube may be using SABR or server-side ads.")

@app.route('/stream_audio', methods=['GET'])
def stream_audio():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Missing 'url' query parameter"}), 400
    
    try:
        audio_url = generate_audio(url)
        return jsonify({"audio_url": audio_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
