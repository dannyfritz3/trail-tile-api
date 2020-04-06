from datetime import datetime

def parseTimestamp(timestamp):
    timestamp_split = timestamp.split(", ")
    timestamp_date = timestamp_split[0]
    timestamp_time = timestamp_split[1]
    
    timestamp_date_split = timestamp_date.split("-")
    timestamp_month = int(timestamp_date_split[0])
    timestamp_day = int(timestamp_date_split[1])
    timestamp_year = int(timestamp_date_split[2])

    today = datetime.now()

    if today.year - timestamp_year == 0:
        if(today.month == timestamp_month):
            if(today.day == timestamp_day):
                return "Today"
            elif(today.day - timestamp_day == 1):
                return "Yesterday"
            else:
                return "%d days ago" % (today.day - timestamp_day)
        elif today.month - timestamp_month == 1:
            days = 31 - timestamp_day + today.day;
            return "%d days ago" % (days)
        else:
            return "%d months ago" % (today.month - timestamp_month)
    elif today.year - timestamp_year == 1:
        months = 12 - timestamp_month + today.month
        return "%d months ago" % (months)
    else:
        return "%d years ago" % (today.year - timestamp_year)