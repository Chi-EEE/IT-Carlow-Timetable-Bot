# IT-Carlow-Timetable-Bot
Timetable Bot which pings you on Discord.com
**(Originally Designed for private use)**

http://timetable.itcarlow.ie/
## Steps: 
1. Open the sln file.
1. Build the solution (To make the ``\bin\Debug\netcoreapp3.1``) using Visual Studio
1. Open ``\bin\Debug\netcoreapp3.1`` using File Explorer.
1. Add a file called "config.json"
1. Type the following into the file using notepad++:
```
{
  "token": "Discord Bot Token",
  "prefix": "?",
  "website": "List Format of your timetable",
  "serverId": Discord Server ID,
  "channelId": Discord Server Channel ID
}
```
6. Edit the token, website, serverId, and channelId variables. eg: 
```
{
  "token": "12344457754",
  "prefix": "?",
  "website": "http://timetable.itcarlow.ie/reporting/textspreadsheet;student+set;id;KCCGDB%5F1A%20CW208%0D%0A?t=student+set+textspreadsheet&days=1-5&weeks=&periods=5-40&template=student+set+textspreadsheet",
  "serverId": 302094807046684672,
  "channelId": 302235979199283201
}
```
7. Create a shortcut to the exe file in the ``\bin\Debug\netcoreapp3.1``
1. Put the shortcut in your desktop (For easy access)

### Steps to getting List Format of your timetable:

1. Go to http://timetable.itcarlow.ie/studentset.htm
1. Set your Department.
1. Select your Student Group
1. Change Timetable Layout to **List Format**
1. Copy the link from the Address bar

#### Date: 26/10/2020 (Made within 1 week with no previous knowledge of C#)
