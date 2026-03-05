# SecureShop — Red Team vs Blue Team

**Projet M1 APPW** — Sécurité des Applications Web
École IT — 2025

---

## Contexte

SecureShop est une plateforme e-commerce complète déployée en environnement Docker. L'application a été développée rapidement par une équipe fictive de développeurs juniors et mise en production sans audit de sécurité préalable.

Votre mission : auditer cette application en conditions réalistes, en endossant alternativement les rôles de **Red Team** (attaquants) et de **Blue Team** (défenseurs).

## Objectifs Pédagogiques

- Maîtriser la méthodologie de test d'intrusion sur une application web complète
- Identifier et exploiter des vulnérabilités dans un contexte réaliste
- Mettre en place des mécanismes de détection et de réponse aux incidents
- Rédiger des rapports professionnels d'audit de sécurité
- Travailler en équipe dans un cadre Red Team / Blue Team

## Architecture Technique

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▸│    Nginx     │────▸│   Backend    │
│   React.js   │     │ Reverse Proxy│     │ Node/Express │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                          ┌───────────────────────┼───────────────────┐
                          │                       │                   │
                    ┌─────▾─────┐          ┌──────▾─────┐    ┌───────▾──────┐
                    │   MySQL   │          │  MongoDB   │    │    Redis     │
                    │  (données)│          │  (sessions)│    │   (cache)    │
                    └───────────┘          └────────────┘    └──────────────┘
```

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Frontend | React.js | Interface utilisateur |
| Backend | Node.js / Express | API REST |
| BDD relationnelle | MySQL | Données produits, utilisateurs, commandes |
| BDD documents | MongoDB | Sessions, logs, reviews |
| Cache | Redis | Cache et sessions |
| Reverse Proxy | Nginx | Routage et terminaison |
| Monitoring | ELK Stack | Centralisation des logs |
| Dashboard | Grafana | Visualisation des métriques |

## Installation et Lancement

### Prérequis

- Docker et Docker Compose
- Node.js 18+
- Python 3.9+ (pour les outils Red/Blue Team)
- Git

### Démarrage rapide

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd m1appw-secureshop

# 2. Lancer l'infrastructure complète
cd infrastructure/docker
docker-compose up -d

# 3. Vérifier que les services sont actifs
docker-compose ps

# 4. Installer les dépendances backend
cd ../../secureshop-app/backend
npm install

# 5. Démarrer le backend
npm start
```

### Accès aux services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface e-commerce |
| API | http://localhost:4000 | API REST backend |
| Kibana | http://localhost:5601 | Exploration des logs |
| Grafana | http://localhost:3001 | Dashboard de métriques |

### Outils Python (Red Team / Blue Team)

```bash
# Installer les dépendances Python
pip install -r requirements.txt
```

## Structure du Projet

```
m1appw-secureshop/
│
├── secureshop-app/                # Application e-commerce
│   ├── backend/                   # API Node.js / Express
│   │   ├── src/
│   │   │   ├── routes/            # Endpoints API
│   │   │   ├── middleware/        # Middleware
│   │   │   ├── models/            # Modèles
│   │   │   └── app.js             # Point d'entrée
│   │   └── package.json
│   ├── frontend/                  # Interface React
│   └── database/                  # Scripts init BDD
│
├── red-team/                      # Outils offensifs
│   ├── recon/
│   ├── exploitation/
│   ├── post-exploitation/
│   └── exfiltration/
│
├── blue-team/                     # Outils défensifs
│   ├── detection/
│   ├── monitoring/
│   ├── incident-response/
│   └── dashboards/
│
├── infrastructure/
├── tests/
├── docs/
└── requirements.txt
```

## Déroulement du Projet (5 jours)

### Phase 1 — Reconnaissance (Jour 1)
Cartographier l'application : endpoints API, technologies, surface d'attaque.

### Phase 2 — Exploitation (Jours 2-3)
Identifier et exploiter les vulnérabilités. Documenter chaque vulnérabilité avec PoC.

### Phase 3 — Défense et Détection (Jour 4)
Mettre en place la détection des attaques. Règles SIEM, monitoring, dashboards.

### Phase 4 — Rapport et Soutenance (Jour 5)
Rédiger les rapports d'audit et de réponse aux incidents. Soutenance.

## Livrables

### Red Team
- Rapport de reconnaissance
- Scripts d'exploitation fonctionnels et documentés
- Rapport de pentest (CVSS, PoC, recommandations)

### Blue Team
- Règles de détection SIEM
- Scripts de monitoring avec alertes
- Playbook de réponse aux incidents
- Dashboard Grafana

## Évaluation

| Critère | Pondération |
|---------|------------|
| Excellence Technique | 40% |
| Méthodologie | 35% |
| Communication | 25% |

> Évaluation 100% pratique.

## Ressources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)
- [Elastic SIEM](https://www.elastic.co/guide/en/security/current/index.html)

## Notes

- Les outils Red/Blue Team sont des squelettes Python à implémenter
- L'application backend est fonctionnelle — analysez le code source
- Commits réguliers avec messages descriptifs
- Usage éducatif uniquement

---
Master 1 APPW — École IT — 2025
