# BETA TEST PLAN  
**Document Name**: beta_test_plan.md  
**Repository**: [Github Finna](https://github.com/eipFinna/FINNA_MIRROR)

---

## 1. Selection of Core Functionalities  
The essential features for the beta version of Finna are:  
- **Information Verification**: Users can submit an excerpt (article, tweet, etc.), and Finna searches for matching sources.  
  - **Priority**: High  

- **Automatic Summary**: The LLM AI summarizes the retrieved articles.  
  - **Priority**: High  

- **Web Extension**: Provides quick access and integrates into the browser.  
  - **Priority**: High  

- **Website (Landing + Feedback)**: Allows users to download the extension and send feedback.  
  - **Priority**: Medium  

- **Scraping and Storage**: Python scripts automatically fetch and store articles.  
  - **Priority**: Medium  

---

## 2. Definition of Beta Testing Scenarios  
The test scenarios cover the following user roles:  
- **End-User**: The final user of the extension.  
- **Administrator**: Responsible for data management and maintenance.  
- **External Partner**: Third-party collaborator providing content or feedback.  

### Scenario 1: Information Verification  
- **Priority**: High  
- **User Role**: End-User  
- **Feature**: Submit an excerpt and get sources.  
- **Expected Outcome**: Finna displays all relevant sources for the submitted content.  
- **Steps**:  
  1. Copy a tweet or article excerpt.  
  2. Paste it into the extension search bar.  
  3. Click "Verify".  
  4. Check if the sources are properly displayed.  
- **Success Criteria**: All relevant sources are displayed with clickable links.  

### Scenario 2: Automatic Summary  
- **Priority**: High  
- **User Role**: End-User  
- **Feature**: Summary generation by LLM AI.  
- **Expected Outcome**: A short and relevant summary is generated.  
- **Steps**:  
  1. Submit an article excerpt.  
  2. Check if the summary appears below the sources.  
  3. Compare the summary to the full source content for relevance.  
- **Success Criteria**: The summary is concise (under 100 words) and captures the main points.  

### Scenario 3: Web Extension  
- **Priority**: High  
- **User Role**: End-User  
- **Feature**: Use of the browser extension.  
- **Expected Outcome**: The extension operates smoothly without slowing down the browser.  
- **Steps**:  
  1. Install the extension from the landing page.  
  2. Confirm its presence in the extensions bar.  
  3. Use it on various websites to verify functionality.  
- **Success Criteria**: The extension responds instantly and does not affect browser performance.  

---

## 3. Coverage of Key User Journeys  
To ensure full coverage of user experiences, the test scenarios include:  
- **Information Search**: Verifying a snippet copied from social media.  
- **Source Exploration**: Navigating between the displayed sources.  
- **User Feedback**: Submitting feedback via the landing page.  
- **Edge Cases**:  
  - No results found: The user is informed clearly and respectfully.  
  - Connection errors: Errors are handled gracefully with informative messages.  

---

## 4. Clear Evaluation Criteria  
- **Stability**: No crashes or interruptions over at least 10 consecutive sessions.  
- **Performance**: The app should remain responsive and smooth during use.  
- **Accuracy**: Summaries must achieve over 85% relevance compared to source content.  
- **Usability**: At least 80% of beta testers give positive feedback on ease of use.  
- **User Interactions**: For detailed evaluation of user interactions, please refer to the interactors document included in the Finna documentation.  

---

## 5. Deliverables & Format  
- **Beta Test Plan**: This document outlines all test scenarios.  
- **Test Reports**: Structured reports generated during each test phase.  
- **Tester Feedback**: Collected via Discord and the Finna website.  
- **Documentation**: User documentation updated based on test feedback.  

---

## 6. Expected Outcome  
This beta test plan aims to:  
- **Validate core functionalities** of Finna for public use.  
- **Evaluate stability, performance, and usability** of the extension.  
- **Collect real user feedback** to guide the final development phase.  
- **Prepare the project presentation** for the end-of-year jury by showing how goals were achieved.
