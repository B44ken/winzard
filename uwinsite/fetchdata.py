import requests, sys

def fetch_course_id(c_id, dbcsprd, session_id):
    response = requests.get(
        # EMPLOYEE/SA/c/SSR_STUDENT_FL.SSR_CRSE_INFO_FL.GBL?Page=SSR_CRSE_INFO_FL&Action=U&Page=SSR_CS_WRAP_FL&Action=U&ACAD_CAREER=UGRD&CRSE_ID=004800&CRSE_OFFER_NBR=1&INSTITUTION=UWIN1&STRM=2241
        f'https://student.uwindsor.ca/psc/DBCSPRD_{dbcsprd}/EMPLOYEE/SA/c/SSR_STUDENT_FL.SSR_CRSE_INFO_FL.GBL',
        params = {
            'Page': 'SSR_CRSE_INFO_FL',
            'Action': 'U',
            'ACAD_CAREER': 'UGRD', # todo: check for grad/undergrad 
            'CRSE_ID': c_id,
            'CRSE_OFFER_NBR': '1',
            'INSTITUTION': 'UWIN1',
            'STRM': '2241',
        },
        cookies = {
            'psprdweb-PORTAL-PSJSESSIONID': session_id
        } )
    try:
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(e)
        return None


def fetch_course_search(search, session_id):
    response = requests.get(
        'https://student.uwindsor.ca/psc/DBCSPRD_25/EMPLOYEE/SA/c/SSR_STUDENT_FL.SSR_CLSRCH_ES_FL.GBL',
        params = {
            'Page': 'SSR_CLSRCH_ES_FL',
            'SEARCH_GROUP': 'SSR_CLASS_SEARCH_LFF',
            'SEARCH_TEXT': search,
            'ES_INST': 'UWIN1',
            'ES_STRM': '2241',
            'ES_ADV': 'N',
            'INVOKE_SEARCHAGAIN': 'PTSF_GBLSRCH_FLUID'
        },
        cookies = {
            'psprdweb-PORTAL-PSJSESSIONID': session_id
        } )
    try:
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(e)
        return None

if __name__ == '__main__':
    print(fetch_course_search('MATH 1730'))