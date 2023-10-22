# university of windsor wizard
completely a work in progress, i have absolutely no direction whatsoever here, yadda yadda

### using the uwinsite scraper demo
the demo is at `demo.py`. to run, use 
```bash
export SESSION_ID="session id"
python3 demo.py "search term"
```
on [student.uwindsor.ca](https://student.uwindsor.ca), the session id is stored in your cookies, called `psprdweb-PORTAL-PSJSESSIONID`. in chrome, the easiest way to get it is by opening the developer tools, going to the application tab, then cookies, then student.uwindsor.ca, then copying the entry for `psprdweb-PORTAL-PSJSESSIONID`.

# path & file structure
- **uwinsite** (uwnsite student scraper)
	- **data** (outputs such as course data)
		- **courses**
			- **winter2024**
		- **winter2024.json** (all courses in winter 2024)
	- demo.py (scraper demo)
- **calendar** (scrapers for the undergraduate calendar)
- **server** (course data api)
- **web** (prototypes for the frontend)
	- **planner-alpha** (cross-semester degree planner/generator)
	- **timetable-alpha** (semester timetable planner/generator)
