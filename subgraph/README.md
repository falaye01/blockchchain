# The Graph Subgraph for CryptoFund Protocol

This directory contains the complete Subgraph configuration for indexing and querying the CryptoFund smart contract events using GraphQL.

---

## 📊 Indexed Entities

- `Campaign`: Title, description, funding target, deadline, image, category, status.
- `Donation`: Individual backer contributions, ETH amounts, timestamps, transaction hashes.
- `ProjectUpdate`: Creator development updates, roadmaps, milestones.
- `Comment`: Community backer discussion and feedback threads.
- `Donor`: Aggregated backer profiles with total contributions.
- `ProtocolMetric`: Global volume and platform statistics.

---

## 🛠️ Deploying to The Graph Studio

1. **Install Subgraph CLI**:
   ```bash
   npm install -g @graphprotocol/graph-cli
   ```

2. **Authenticate with The Graph Studio**:
   ```bash
   graph auth --studio <YOUR_DEPLOY_KEY>
   ```

3. **Generate Types & Build**:
   ```bash
   graph codegen
   graph build
   ```

4. **Deploy**:
   ```bash
   graph deploy --studio cryptofund-protocol
   ```
