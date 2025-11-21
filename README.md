# Target Repurposing Hypothesizer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP-green.svg)
![Tech](https://img.shields.io/badge/tech-React%20%7C%20TypeScript%20%7C%20GNN-blueviolet)

**Target Repurposing Hypothesizer** is a cutting-edge R&D acceleration platform designed for pharmaceutical discovery. It leverages Graph Neural Networks (GNNs) to predict high-probability novel links between existing compounds and disease-associated proteins, facilitating rapid drug repurposing.

## 🚀 Overview

Drug development is slow and expensive. Traditional methods often fail to capture the complex, multi-factor relationships within biological networks. This platform ingests heterogeneous graph data (Compounds, Proteins, Interactions) and uses a GNN-based encoder-decoder architecture to generate ranked therapeutic hypotheses.

**Key Value:** Drastically reduces initial screening costs by prioritizing known compounds for novel therapeutic uses through AI-driven link prediction.

## ✨ Key Features

*   **Heterogeneous Graph Visualization**: Interactive, force-directed graph exploration of Compound-Target networks using D3.js.
*   **AI-Powered Hypothesis Generation**: sophisticated link prediction engine that ranks novel Compound-Protein pairs.
*   **Generative AI Explanations**: Integrated **Google Gemini API** provides real-time scientific context and mechanism-of-action hypotheses for predicted links.
*   **Custom Data Ingestion**: Drag-and-drop interface for researchers to upload their own CSV datasets (Interactions & Features) for immediate analysis.
*   **Training Metrics Monitor**: Real-time visualization of model performance (Loss, AUROC) during the training phase.
*   **Exportable Results**: Downloadable CSV reports of top predicted candidates for wet-lab validation.

## 🛠️ Technical Architecture

*   **Frontend**: React 19, TypeScript, Tailwind CSS
*   **Visualization**: D3.js (Force Graph), Recharts (Training Metrics)
*   **AI Integration**: Google GenAI SDK (Gemini 2.5 Flash)
*   **Data Structure**: PyG HeteroData compatible formatting
*   **State Management**: React Hooks & Context

## 📸 Screenshots

### Executive Dashboard
*Overview of graph topology, training metrics, and top ranked hypotheses.*
![Dashboard Screenshot](./screenshots/dashboard.png)
*(Add your dashboard screenshot here)*

### Graph Explorer
*Deep dive into the interaction network with node-specific details.*
![Graph Explorer](./screenshots/graph_explorer.png)
*(Add your graph explorer screenshot here)*

### Hypothesis Generation & AI Analysis
*Ranked table of predictions with Gemini-powered biological explanations.*
![Predictions](./screenshots/predictions.png)
*(Add your prediction analysis screenshot here)*

### Data Ingestion Pipeline
*Upload custom CSV datasets for processing.*
![Data Upload](./screenshots/upload.png)
*(Add your upload screen screenshot here)*

## 🏁 Getting Started

### Prerequisites
*   Node.js (v16+)
*   Google Gemini API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/target-repurposing-hypothesizer.git
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_google_gemini_api_key
    ```

4.  Start the application:
    ```bash
    npm start
    ```

## 📊 Data Format

To use the **Custom Data Upload** feature, prepare your CSV files with the following headers:

**Interactions File (Required):**
```csv
compound_id,protein_id
C001,P53
C002,EGFR
...
```

**Features File (Optional):**
```csv
compound_id,feature_vec
C001,"[0,1,0...]"
...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
