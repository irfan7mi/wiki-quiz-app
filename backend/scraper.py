import requests
from bs4 import BeautifulSoup
from typing import Dict, List
import re


def scrape_wikipedia(url: str) -> Dict[str, any]:
    """
    Scrape Wikipedia URL and extract:
    - Title
    - First 10 paragraphs
    - All H2 headers
    
    Returns a dictionary with the scraped content.
    """
    try:
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title_elem = soup.find('h1', class_='firstHeading')
        title = title_elem.get_text(strip=True) if title_elem else "Unknown Title"
        
        # Find the main content area
        content_div = soup.find('div', class_='mw-parser-output')
        if not content_div:
            raise ValueError("Could not find main content area")
        
        # Extract first 10 paragraphs
        paragraphs = []
        for p in content_div.find_all('p', recursive=False):
            text = p.get_text(strip=True)
            # Skip empty paragraphs and short ones (likely navigation/templates)
            if text and len(text) > 50:
                paragraphs.append(text)
                if len(paragraphs) >= 10:
                    break
        
        # Also check nested paragraphs if we don't have 10 yet
        if len(paragraphs) < 10:
            for p in content_div.find_all('p'):
                text = p.get_text(strip=True)
                if text and len(text) > 50 and text not in paragraphs:
                    paragraphs.append(text)
                    if len(paragraphs) >= 10:
                        break
        
        # Extract all H2 headers
        h2_headers = []
        for h2 in content_div.find_all('h2'):
            # Skip the "Contents" header and navigation sections
            span = h2.find('span', class_='mw-headline')
            if span:
                header_text = span.get_text(strip=True)
                # Skip common navigation sections
                if header_text.lower() not in ['contents', 'see also', 'references', 'external links', 'navigation menu']:
                    h2_headers.append(header_text)
        
        # Combine all content
        paragraphs_text = "\n\n".join(paragraphs)
        headers_text = "\n".join([f"## {h}" for h in h2_headers])
        
        scraped_content = f"{title}\n\n{paragraphs_text}\n\n{headers_text}"
        
        return {
            "title": title,
            "paragraphs": paragraphs,
            "h2_headers": h2_headers,
            "full_text": scraped_content
        }
    
    except requests.RequestException as e:
        raise ValueError(f"Error fetching URL: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error parsing content: {str(e)}")

