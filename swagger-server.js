const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Load the OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'docs/api/openapi.yaml'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Student Certificate Verification System API',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
}));

// Redirect root to swagger docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'swagger-ui',
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log(`🔍 Swagger UI Server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Direct access: http://localhost:${PORT}`);
  console.log(`📋 API Specification: docs/api/openapi.yaml`);
});