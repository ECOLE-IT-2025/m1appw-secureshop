# SecureShop Architecture

## System Overview

SecureShop is a multi-tier e-commerce application designed for cybersecurity education purposes. The system is containerized and includes monitoring, logging, and analytics capabilities.

## Architecture Components

### Frontend
- **Technology**: React.js
- **Port**: 3000
- **Features**: Product browsing, user authentication, shopping cart, order management

### Backend API
- **Technology**: Node.js with Express.js
- **Port**: 4000
- **Features**: RESTful API, user management, product catalog, order processing, authentication

### Database Layer

#### MySQL
- **Purpose**: Primary relational database
- **Port**: 3306
- **Data**: Users, products, orders, categories

#### MongoDB
- **Purpose**: NoSQL document database
- **Port**: 27017
- **Data**: User sessions, logs, metadata

#### Redis
- **Purpose**: In-memory cache and session store
- **Port**: 6379
- **Usage**: Session caching, rate limiting, temporary data

### Reverse Proxy
- **Technology**: Nginx
- **Port**: 80, 443
- **Functions**: Request routing, SSL/TLS termination, load balancing

### Monitoring & Logging Stack

#### Elasticsearch
- **Port**: 9200
- **Purpose**: Centralized log storage and indexing

#### Logstash
- **Port**: 5000
- **Purpose**: Log processing and transformation pipeline

#### Kibana
- **Port**: 5601
- **Purpose**: Log visualization and analysis interface

#### Filebeat
- **Purpose**: Lightweight log collection agent

#### Metricbeat
- **Purpose**: System and service metrics collection

### Metrics & Visualization
- **Grafana**: Performance monitoring and custom dashboards
- **Port**: 3001

## Data Flow

1. **User Requests** → Nginx (reverse proxy)
2. **Nginx** → Routes to Frontend or Backend
3. **Backend** → Queries MySQL, MongoDB, uses Redis cache
4. **Logging** → Application logs → Filebeat → Logstash → Elasticsearch
5. **Visualization** → Kibana & Grafana

## Security Considerations

### Network Isolation
- Services communicate via Docker internal network
- Ports are selectively exposed to host
- Environment variables for sensitive configuration

### Authentication & Authorization
- User authentication through API
- Session management via Redis
- JWT token-based API access

### Monitoring & Logging
- Comprehensive application logging
- System event tracking
- Audit trail for user actions
- Real-time alerting capabilities

## Deployment

All services are containerized using Docker Compose.

```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

## Infrastructure Files

```
infrastructure/
├── docker/
│   └── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── elk/
│   └── docker-compose.elk.yml
└── grafana/
    └── provisioning/
```
