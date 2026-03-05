# M1 APPW SecureShop - Red Team vs Blue Team Cybersecurity Exercise

## Project Overview

SecureShop is a deliberately vulnerable e-commerce application designed for cybersecurity education at Master 1 (M1) level. Students divide into **Red Team** (attackers) and **Blue Team** (defenders) to practice offensive and defensive security skills.

**WARNING**: This application contains intentional security vulnerabilities for educational purposes only. Do NOT use in production.

---

## Quick Start

### Starting the Application

```bash
cd m1appw-secureshop
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:4000
# API Docs: http://localhost:4000/api-docs
# Kibana: http://localhost:5601 (logs)
# Grafana: http://localhost:3001 (metrics)
```

---

## Project Structure

```
m1appw-secureshop/
├── infrastructure/         # Docker, Nginx, ELK stack configs
├── secureshop-app/        # Frontend (React) & Backend (Node.js)
│   ├── backend/           # Express API with vulnerabilities
│   ├── frontend/          # React e-commerce interface
│   └── database/          # MySQL, MongoDB, Redis init scripts
├── red-team/              # Offensive security tools
│   ├── recon/             # Reconnaissance and enumeration
│   ├── exploitation/      # Exploitation scripts (SQL injection, JWT)
│   ├── post-exploitation/ # Persistence and privilege escalation
│   └── exfiltration/      # Data extraction tools
├── blue-team/             # Defensive security tools
│   ├── detection/         # SIEM rules and log analysis
│   ├── monitoring/        # Real-time monitoring
│   ├── incident-response/ # Incident response playbooks
│   └── dashboards/        # Grafana dashboards
├── tests/                 # Unit and integration tests
└── docs/                  # Architecture documentation
```

---

## Key Vulnerabilities

1. **SQL Injection** - Search and category parameters
2. **JWT Weaknesses** - Weak secret, 'none' algorithm, no verification
3. **IDOR** - Direct access to other users' resources
4. **Race Conditions** - Inventory management in orders
5. **Weak Input Validation** - No sanitization

---

## Red Team (Offensive)

### Tasks
- Enumerate infrastructure and services
- Exploit SQL injection vulnerabilities
- Forge JWT tokens and bypass authentication
- Perform IDOR attacks on user data
- Create persistence mechanisms
- Exfiltrate sensitive data

### Tools (Skeleton Files to Complete)
```bash
python3 red-team/recon/enumerate.py -t localhost
python3 red-team/exploitation/sql_injection.py -u http://localhost:4000
python3 red-team/exploitation/jwt_attack.py -u http://localhost:4000
python3 red-team/post-exploitation/persistence.py -u http://localhost:4000
python3 red-team/exfiltration/exfil_tool.py -m https
```

---

## Blue Team (Defensive)

### Tasks
- Create SIEM detection rules for attacks
- Analyze logs for security events
- Set up real-time monitoring and alerting
- Document incident response procedures
- Fix vulnerabilities and harden the application

### Tools (Skeleton Files to Complete)
```bash
python3 blue-team/detection/scripts/log_analyzer.py -f logs.json
python3 blue-team/monitoring/monitor.py -c config.yml
# Edit: blue-team/detection/rules/suspicious_activity.yml
# Edit: blue-team/incident-response/playbook_template.md
```

---

## Sample Credentials

```
Admin: admin / password123
User1: user1 / weak_password
User2: user2 / 123456

MySQL: secureshop_user / SecureShop123!
```

---

## Testing

```bash
pytest tests/ -v
pytest tests/test_recon.py -v
pytest tests/test_detection.py -v
```

---

## Documentation

See `docs/architecture.md` for detailed system architecture and vulnerability descriptions.

---

## Important Notes

- All Python files are SKELETONS with `raise NotImplementedError()`
- Students MUST complete the implementations
- Use French comments where appropriate (école française)
- Add comprehensive docstrings
- Include TODO markers for guidance
- Never include working exploits in the skeleton

---

**For Educational Use Only**  
Master 1 APPW Cybersecurity  
2024
