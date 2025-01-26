# **Finna**

Simplify information verification and fight misinformation with an intuitive and powerful web extension.

---

## **Table of Contents**

1. [Context](#context)  
2. [Problem Statement](#problem-statement)  
3. [Proposed Solution](#proposed-solution)  
4. [Technologies](#technologies)  
5. [Features](#features)  
6. [Installation and Usage](#installation-and-usage)  
7. [Contributors](#contributors)  
8. [License](#license)  

---

## **Context**

In a world where misinformation spreads rampantly, verifying content authenticity has become essential. In France, 39% of citizens use digital media for news, yet 30% say they cannot detect fake news (source: [Statista](https://fr.statista.com/statistiques/960803/verification-informations-lues-jeunes-france/)).  

---

## **Problem Statement**

**How can we simplify the comparison of information to ensure its reliability?**  

Faced with poorly sourced or misleading content, it is crucial to provide users with the tools they need to quickly verify the truthfulness of information.

---

## **Proposed Solution**

Finna is a web extension designed to:  
1. Identify the sources of information.  
2. Generate clear summaries using AI.  
3. Provide direct access to references so users can validate content reliability themselves.  

**Example of Use:**  
- The user selects a suspicious text or excerpt.  
- Finna analyzes the content, searches for matching articles in a rich database, and generates a concise summary with all references.  

---

## **Technologies**

The project is built using a modern and robust stack:  
- **Frontend:** React  
- **Backend:** Node.js  
- **Database:** MySQL  
- **AI:** LLM Models (Meta-Llama, Google-Gemma, etc.)  
- **Scripts:** Python for scraping  
- **CI/CD:** Git and Bash  
- **Testing:** Unit tests for reliability  

---

## **Features**

1. **Information Verification:** Instant analysis of textual content.  
2. **Smart Summaries:** AI-powered synthesis of articles.  
3. **Enriched Database:** Automatic population via scraping scripts.  
4. **Intuitive Landing Page:** Enables extension installation and feedback collection.  
5. **Social Interactions:** Discord integration and use of platforms like X (Twitter) to raise awareness.

---

## **Installation and Usage**

### **Installation:**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-repo/finna.git
   cd finna
   ```

2. Install depedencies:
   ```bash
    npm install
   ```

3. Start the project:
   ```bash
    npm start
   ```

### **Web Extension**  
1. Navigate to the official [Finna website](#) to download the browser extension.  
2. Follow the installation instructions provided on the site to add the extension to your browser.  
3. Start verifying information by pasting suspicious text into the extension’s search bar.

---

## **Contributors**  
The **Finna Team** from Epitech:  
- A dedicated group of tech enthusiasts striving to combat misinformation and empower users with reliable tools.  

---

## **License**  
This project is open-source and available under the **MIT License**. For more details, see the [LICENSE](./LICENSE) file.
