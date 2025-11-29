from hijridate import Hijri, Gregorian
from datetime import date

def get_hijri_date():
    today = date.today()
    hijri = Gregorian(today.year, today.month, today.day).to_hijri()
    
    hijri_months = [
        "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
        "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban",
        "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah"
    ]
    
    month_name = hijri_months[hijri.month - 1]
    return f"{hijri.day} {month_name} {hijri.year} AH"

if __name__ == "__main__":
    print(get_hijri_date())
