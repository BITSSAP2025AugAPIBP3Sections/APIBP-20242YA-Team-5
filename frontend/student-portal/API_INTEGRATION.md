# Certificate Service API Integration

This document describes how the Student Portal frontend connects to the Certificate Service backend.

## API Configuration

The API base URL is configured via environment variables:
- Development: `REACT_APP_API_URL=http://localhost:3000/api`
- Production: Set via environment configuration

## Certificate Service Integration

### Services
- `CertificateService`: Handles all API communication with the certificate service
- Located in: `src/services/certificateService.ts`

### Types
- Certificate types and interfaces are defined in `src/types/certificate.ts`
- Matches the Java backend model structure

### Hooks
- `useCertificates`: Hook for managing certificate list state
- `useCertificate`: Hook for managing single certificate state
- Located in: `src/hooks/useCertificates.ts`

## Available Endpoints

### GET /certificates
- Fetch all certificates for the current student
- Optional status filter: `?status=ACTIVE|PENDING|REVOKED|EXPIRED`

### GET /certificates/{id}
- Fetch a specific certificate by ID

### GET /certificates/{id}/pdf
- Download certificate as PDF
- Requires authentication

### POST /certificates
- Issue new certificate (admin/university only)

### PUT /certificates/{id}
- Update existing certificate (admin/university only)

### POST /certificates/revoke
- Revoke a certificate (admin/university only)

## Authentication

The frontend sends JWT tokens via Authorization header:
```
Authorization: Bearer <token>
```

Tokens are stored in localStorage as `authToken`.

## Error Handling

- Network errors are caught and displayed to users
- 401 errors automatically redirect to login
- Loading and error states are managed in hooks

## Usage Examples

### Fetching Certificates
```typescript
const { certificates, loading, error, fetchCertificates } = useCertificates();

// Filter by status
await fetchCertificates('ACTIVE');
```

### Downloading Certificate
```typescript
const { downloadCertificate } = useCertificates();

await downloadCertificate(certificateId);
```

### Sharing Certificate
```typescript
const shareUrl = `${window.location.origin}/verify/${certificate.verificationCode}`;
navigator.clipboard.writeText(shareUrl);
```

## Components

### Updated Components
- `pages/Certificates.tsx`: Shows certificate list with real data
- `pages/Dashboard.tsx`: Shows certificate statistics and recent certificates

### Features
- Real-time certificate loading
- Status filtering
- PDF download
- Share verification links
- Error handling and retry
- Loading states
- Empty states

## Next Steps

1. **Authentication**: Implement proper login/logout flow
2. **University Service**: Connect to university endpoints
3. **Verification Service**: Add public verification page
4. **Error Boundaries**: Add React error boundaries
5. **Testing**: Add unit and integration tests
6. **Caching**: Implement proper API caching strategy