from bs4 import BeautifulSoup
import requests
import re
import json
from ParseTimestamp import parseTimestamp
import pymongo

client = pymongo.MongoClient("mongodb+srv://dbUser:1234password@morc-trail-cluster-2oaql.gcp.mongodb.net/test?retryWrites=true&w=majority")
db = client.trail_data
collection = db.trails

def main():
    trail_data = scrape_for_trail_data()
    collection.remove()
    for trail in trail_data:
        test_id = collection.insert_one(trail)

def scrape_for_trail_data():
    page = requests.get("http://www.morcmtb.org/forums/trailconditions.php")
    soup = BeautifulSoup(page.content, 'html.parser')

    contents = soup.contents
    raw_trail_info = []
    parsed_trail_info = []

    for item in contents:
        if not isinstance(item, str):
            item_text = getattr(item, 'text')
            if item_text.endswith('\r\n\n\n'):
                raw_trail_info.append(item.text)

    keys = ["name", "condition", "comments", "username", 
            "timestamp", "parsedTimestamp", "location", 
            "trailforksMapId", "reimtbX", "reimtbY", 
            "trail_id", "lat", "lon"]

    with open('./utility-data/static_location_data.json') as infile:
        location_data = json.load(infile);

        for item in raw_trail_info:
            parsed_data_str = re.sub(r"((\r)*(\n)+(\t)*(\r)*(\n)*(\t)*)", '|', item)
            parsed_data_obj = parsed_data_str[1:len(parsed_data_str)-1].split('|')
            if len(parsed_data_obj) > 5:
                for x in range(3, len(parsed_data_obj)-2):
                    parsed_data_obj[2] += parsed_data_obj.pop(3)
            parsed_data_obj.append(parseTimestamp(parsed_data_obj[4]))
            parsed_data_obj.append(location_data[parsed_data_obj[0]].get("location"))
            parsed_data_obj.append(location_data[parsed_data_obj[0]].get("data-rid"))
            parsed_data_obj.append(location_data[parsed_data_obj[0]].get("reimtbX"))
            parsed_data_obj.append(location_data[parsed_data_obj[0]].get("reimtbY"))
            parsed_data_obj.append(location_data[parsed_data_obj[0]].get("trail_id"))
            parsed_data_obj.append(location_data[parsed_data_obj[0]].get("lat"))
            parsed_data_obj.append(location_data[parsed_data_obj[0]].get("lon"))
            parsed_data_obj = dict(zip(keys, parsed_data_obj))
            parsed_trail_info.append(parsed_data_obj)

    return parsed_trail_info

if __name__ == "__main__":
    main()
