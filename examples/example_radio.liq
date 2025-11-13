#!/usr/bin/liquidsoap

# Example radio station configuration for LiquidSoap 2.4.0
# This demonstrates common patterns and best practices

# Set log level
log.level.set(4)

# Define paths
music_dir = "/path/to/music"
jingles_dir = "/path/to/jingles"

# Create playlists
music = playlist(
  mode="randomize",
  reload_mode="watch",
  "#{music_dir}/playlist.m3u"
)

jingles = playlist(
  mode="randomize",
  reload=3600,
  "#{jingles_dir}/jingles.m3u"
)

# Normalize audio levels using LUFS (new in 2.4.0)
music = normalize_track_gain(music)
jingles = normalize_track_gain(jingles)

# Add jingle every 3 songs
radio = rotate(weights=[1, 3], [jingles, music])

# Apply crossfade
radio = crossfade(radio)

# Strip blank audio
radio = blank.strip(radio)

# Add fallback to emergency playlist
emergency = single(
  "/path/to/emergency.mp3"
)
radio = fallback(track_sensitive=false, [radio, emergency])

# Setup Harbor for live input
live = input.harbor(
  "live",
  port=8080,
  password="your_password_here"
)

# Live takes priority over automated content
radio = fallback(track_sensitive=false, [live, radio])

# Handle metadata
def on_metadata(m) =
  log("Now playing: #{m['artist']} - #{m['title']}")
end
radio.on_metadata(on_metadata)

# Output to Icecast
output.icecast(
  %mp3(bitrate=128),
  host="localhost",
  port=8000,
  password="hackme",
  mount="radio",
  name="My Radio Station",
  description="Example LiquidSoap 2.4.0 stream",
  genre="Various",
  url="https://example.com",
  radio
)

# Output to HLS for web players
output.file.hls(
  playlist="live.m3u8",
  segment_duration=10.0,
  segments=6,
  "/var/www/html/hls/",
  radio
)

# Schedule a jingle at the top of every hour
top_of_hour_jingle = single("/path/to/top_of_hour.mp3")

cron.add(
  predicate="0 * * * *",
  fun() -> begin
    radio.insert_metadata([
      ("type", "scheduled_jingle"),
      ("comment", "Top of the hour")
    ])
    top_of_hour_jingle.seek(0.0)
  end
)

log("Radio station started successfully!")
