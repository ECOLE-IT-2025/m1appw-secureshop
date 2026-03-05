# SecureShop Architecture

## System Overview
SecureShop is a deliberately vulnerable e-commerce application for cybersecurity education with intentional vulnerabilities.

## Architecture
- Frontend: React (Port 3000)
- Backend: Node.js/Express API (Port 4000)  
- Databases: MySQL, MongoDB, Redis
- Monitoring: Elasticsearch, Kibana, Grafana

## Vulnerabilities
- SQL Injection in search/category parameters
- JWT algorithm validation missing
- IDOR on user profile/order access
- Race conditions in inventory management
- Weak passwords in default credentials

## Security Assessment
### For Red Team
- Discover open ports
- Exploit SQL injection
- Forge JWT tokens
- Perform IDOR attacks
- Extract database content

### For Blue Team
- Implement parameterized queries
- Add JWT validation
- Implement authorization checks
- Enable TLS/SSL
- Create SIEM detection rules
