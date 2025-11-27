# Employer Portal - Certificate Verification

Public-facing portal for employers and organizations to verify the authenticity of academic certificates.

## Features

### Certificate Verification
- **Public Access**: No login required - accessible to anyone
- **Instant Verification**: Enter certificate number to verify authenticity
- **Detailed Information**: View complete certificate details if valid
- **Status Indicators**: Clear visual feedback for valid/invalid/revoked certificates
- **Shareable Links**: Generate and share verification links
- **QR Code Support**: Scan QR codes from certificates to verify

### User Experience
- **Clean Interface**: Minimalist design focused on verification
- **Mobile Responsive**: Works seamlessly on all devices
- **Deep Linking**: Direct links to specific certificate verification
- **Share Functionality**: Native share or copy link to clipboard
- **Real-time Validation**: Instant verification with backend API

## Tech Stack

- **React** 18.2.0
- **TypeScript** 4.9.5
- **Material-UI** 5.14.17
- **React Router** 6.19.0
- **Axios** for API calls

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend services running (verification-service on port 3005)

### Installation

```bash
# Navigate to employer portal
cd frontend/employer-portal

# Install dependencies
npm install
```

### Configuration

Create a `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:3000
PORT=3002
```

### Running the Application

```bash
# Development mode
npm start

# Production build
npm run build
```

The application will be available at: `http://localhost:3002`

## Usage

### Verify Certificate

1. **Direct Access**: Navigate to `/verify`
2. **Enter Certificate Number**: Type or paste the certificate number
3. **Click Verify**: View instant verification results
4. **Share Results**: Copy link or use native share

### Verification Link

Direct verification link format:
```
http://localhost:3002/verify/CERT-2024-001
```

### Integration with Student Portal

Students can share verification links from their certificate page:
- Click "Share" button on certificate card
- Copy generated verification link
- Share with employers/organizations

## API Integration

### Verification Endpoint

```typescript
POST /verification/verify
Content-Type: application/json

{
  "certificateNumber": "CERT-2024-001"
}
```

**Response (Valid Certificate)**:
```json
{
  "valid": true,
  "certificate": {
    "certificateNumber": "CERT-2024-001",
    "studentName": "John Doe",
    "courseName": "Computer Science",
    "universityName": "BITS Pilani",
    "issueDate": "2024-01-15T00:00:00.000Z",
    "grade": "A",
    "status": "ACTIVE"
  },
  "message": "Certificate is valid and active",
  "verifiedAt": "2024-11-27T10:30:00.000Z"
}
```

**Response (Invalid/Revoked)**:
```json
{
  "valid": false,
  "message": "Certificate not found or has been revoked",
  "verifiedAt": "2024-11-27T10:30:00.000Z"
}
```

## Features in Detail

### 1. Public Verification Page
- No authentication required
- Accessible from anywhere
- Works with QR codes
- Mobile-optimized

### 2. Verification Results
- ✅ **Valid Certificate**: Green checkmark with full details
- ❌ **Invalid Certificate**: Red error with reason
- ⚠️ **Revoked Certificate**: Shows as invalid with revocation info

### 3. Shareable Links
- Generate unique verification URLs
- Copy to clipboard
- Native share on mobile devices
- SEO-friendly URLs

### 4. Certificate Details Display
- Student name
- Course information
- University details
- Issue date
- Grade/marks
- Current status
- Verification timestamp

## Security & Privacy

- **No PII Storage**: No user data stored in browser
- **Read-Only Access**: Cannot modify certificates
- **HTTPS Ready**: Production-ready SSL configuration
- **Rate Limiting**: Backend API rate limits prevent abuse

## Deployment

### Production Build

```bash
npm run build
```

Optimized production files in `build/` directory.

### Environment Variables

```env
# Production
REACT_APP_API_BASE_URL=https://api.yourdomain.com

# Development
REACT_APP_API_BASE_URL=http://localhost:3000
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] QR code scanner integration
- [ ] Multi-language support
- [ ] PDF verification report download
- [ ] Batch certificate verification
- [ ] Verification history (optional)
- [ ] Email verification results
- [ ] SMS notification support

## Support

For issues or questions:
- Check backend verification-service logs
- Verify API connectivity
- Check browser console for errors
- Ensure backend is running on correct port

## License

Part of the Certificate Management System - BITS APIBP 2024
