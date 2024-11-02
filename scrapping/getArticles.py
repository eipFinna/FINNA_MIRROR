from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def init_driver():
    options = Options()
    options.headless = True
    options.add_argument('--ignore-certificate-errors')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def scrap_yahoo_part_data(driver):
    driver.get("https://fr.news.yahoo.com/")
    time.sleep(2)

    try:
        accepter_tout_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Accepter tout')]")
        accepter_tout_button.click()
        time.sleep(2)
    except Exception as e:
        print("Error clicking 'Accepter tout':", e)

    i = 0
    while i < 20:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)
        i += 1

    all_articles = driver.find_elements(By.CSS_SELECTOR, "li[data-test-locator='stream-item']")

    for article in all_articles:
        try:
            publisher = article.find_element(By.CSS_SELECTOR, "span[data-test-locator='stream-item-publisher']").text
            if publisher == "AFP":
                title = WebDriverWait(article, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "h3[data-test-locator='stream-item-title']"))
                )
                print(title.text)

                a = WebDriverWait(title, 10).until(
                    EC.element_to_be_clickable((By.TAG_NAME, "a"))
                )
                print(a.text)

                # Scroll the element into view
                driver.execute_script("arguments[0].scrollIntoView(true);", a)
                time.sleep(1)  # Wait for the scroll action

                # Use JavaScript to click the element
                driver.execute_script("arguments[0].click();", a)
                return
        except Exception as e:
            print(f"Error processing article: {e}")

def main():
    driver = init_driver()
    try:
        scrap_yahoo_part_data(driver)
        time.sleep(5)
    finally:
        driver.quit()

if __name__ == "__main__":
    main()