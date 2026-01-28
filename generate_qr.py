#!/usr/bin/env python3
import qrcode
from PIL import Image, ImageDraw

# Generate QR code for scipi.ro - Dark mode version
qr = qrcode.QRCode(
    version=4,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction to allow logo overlay
    box_size=12,
    border=3,
)

qr.add_data('https://scipi.ro')
qr.make(fit=True)

# Create QR code image with dark background and gradient-like blue modules
qr_img = qr.make_image(fill_color="#3B82F6", back_color="#0f172a").convert('RGBA')

qr_width, qr_height = qr_img.size

# Create a new image with rounded corners effect
final_img = Image.new('RGBA', (qr_width + 60, qr_height + 60), '#0f172a')

# Add subtle gradient overlay
draw = ImageDraw.Draw(final_img)

# Create rounded rectangle background
padding = 30
corner_radius = 40

# Draw rounded rectangle
draw.rounded_rectangle(
    [(padding//2, padding//2), (qr_width + padding + padding//2, qr_height + padding + padding//2)],
    radius=corner_radius,
    fill='#1e293b',
    outline='#3B82F6',
    width=3
)

# Paste QR code
final_img.paste(qr_img, (padding, padding))

# Load the favicon/logo
logo = Image.open('public/fav.png').convert('RGBA')

# Calculate the size for the logo (about 22% of QR code)
logo_max_size = qr_width // 4

# Resize logo while maintaining aspect ratio
logo.thumbnail((logo_max_size, logo_max_size), Image.Resampling.LANCZOS)

# Calculate position to center the logo
logo_pos = (
    padding + (qr_width - logo.size[0]) // 2,
    padding + (qr_height - logo.size[1]) // 2
)

# Create a circular dark background for the logo
bg_radius = max(logo.size) // 2 + 15
center_x = padding + qr_width // 2
center_y = padding + qr_height // 2

# Draw circular background with glow effect
for i in range(5, 0, -1):
    glow_alpha = int(30 * (6 - i) / 5)
    glow_color = (59, 130, 246, glow_alpha)  # Blue glow
    draw.ellipse(
        [center_x - bg_radius - i*3, center_y - bg_radius - i*3,
         center_x + bg_radius + i*3, center_y + bg_radius + i*3],
        fill=None,
        outline=glow_color,
        width=2
    )

# Draw main circular background
draw.ellipse(
    [center_x - bg_radius, center_y - bg_radius,
     center_x + bg_radius, center_y + bg_radius],
    fill='#0f172a',
    outline='#3B82F6',
    width=2
)

# Paste the logo
final_img.paste(logo, logo_pos, logo)

# Save the final dark QR code
final_img.save('public/qr_scipi_dark.png')
print('Dark QR code saved to public/qr_scipi_dark.png')

# Also create a simpler dark version without extra styling
qr2 = qrcode.QRCode(
    version=4,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr2.add_data('https://scipi.ro')
qr2.make(fit=True)

qr2_img = qr2.make_image(fill_color="#60a5fa", back_color="#0f172a").convert('RGBA')
qr2_width, qr2_height = qr2_img.size

# Add logo to simple dark version
logo2 = Image.open('public/fav.png').convert('RGBA')
logo2_max_size = qr2_width // 4
logo2.thumbnail((logo2_max_size, logo2_max_size), Image.Resampling.LANCZOS)

# Create circular background for logo
draw2 = ImageDraw.Draw(qr2_img)
center_x2 = qr2_width // 2
center_y2 = qr2_height // 2
bg_radius2 = max(logo2.size) // 2 + 12

draw2.ellipse(
    [center_x2 - bg_radius2, center_y2 - bg_radius2,
     center_x2 + bg_radius2, center_y2 + bg_radius2],
    fill='#0f172a',
    outline='#60a5fa',
    width=2
)

logo2_pos = ((qr2_width - logo2.size[0]) // 2, (qr2_height - logo2.size[1]) // 2)
qr2_img.paste(logo2, logo2_pos, logo2)
qr2_img.save('public/qr_scipi_dark_simple.png')
print('Simple dark QR code saved to public/qr_scipi_dark_simple.png')
