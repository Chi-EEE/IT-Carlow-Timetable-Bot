var selecteditemsarray;
var host = "timetable.itcarlow.ie"; // host name of the SWS server
var startdate = "08/19/2019 00:00:00 GMT"; // this is used by the << last week and this week >> links on the timetable
var pagehost = "timetable.itcarlow.ie"; // this is normally the same as host but since the custom pages can be hosted on a different server need to store in a separate variable

function getTimetable(form, object) {
	var days = form.elements["days"].options[form.elements["days"].selectedIndex].value;
	var weeks = form.elements["weeks"].options[form.elements["weeks"].selectedIndex].value;
	var periods = form.elements["periods"].options[form.elements["periods"].selectedIndex].value;
	var idtype = "id";

	var style = form.elements["style"].options[form.elements["style"].selectedIndex].value;

	var objectstr = "";
	var cookie_filter_val_key = "";
	var cookie_val_key = "";
	if (object == "location") {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_location_vals";
    }
	else if (object == "student+set") {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_student+set_vals";
    }
	else if (object == "staff") {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_staff_vals";
    }
	else if ( (object == "module") || (object == "modulecode")) {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_module_vals";
    }
	else if (object == "programme+of+study") {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_programme_vals";
    }

	if (object == 'modulecode') { object = 'module'; }
	if (object == 'stafftext') { object = 'staff'; }

	var template = object + "+" + style;

	var cookie = new Cookie("sws_cust");
	cookie.reset();
	cookie.set("weeks", weeks);
    if (cookie_filter_val_key != "") {
	    cookie.set(cookie_filter_val_key, form.elements["filter"].options[form.elements["filter"].selectedIndex].value);
    }

	var inputelement = form.elements["identifier"];

	if (inputelement.type == "text" ) {
		objectstr = inputelement.value;
	} else {
		for (var i = 0; i < inputelement.options.length; i++) {
			if (inputelement.options[i].selected) {
				objectstr += inputelement.options[i].value + "%0D%0A";
				cookie.append(cookie_val_key, inputelement.options[i].value);
			}
		}
	}
	objectstr = fixspace(objectstr);
	if (objectstr == "") {
		alert ("Error - no object requested");
		return;
    }
	cookie.save();
    window.location = "http://" + host + "/reporting/" + style + ";" + fixspace(object) +
                      ";" + idtype + ";" + objectstr + "?t=" + template + "&days=" + days + "&weeks=" + weeks + "&periods=" + periods + "&template=" + template;
}

function SetMenuSelections (form, object) {

	var cookie_filter_val_key = "";
	var cookie_val_key = "";
	if ( (object == "location") || (object == "locationdept")) {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_location_vals";
    }
	if (object == "student+set") {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_student+set_vals";
    }
	if (object == "staff") {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_staff_vals";
    }
	if ((object == "module")){
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_module_vals";
    }
	if (object == "programme+of+study") {
        cookie_filter_val_key = "saved_zone_filter_val";
	    cookie_val_key = "saved_programme_vals";
    }

	// only set the sort by radio button if progs, mods or sets
	if ( (object == "programme+of+study") || (object == "student+set") || (object == "module") ) {
		form.elements["sortby"][0].checked = false;
		form.elements["sortby"][1].checked = false;

		if (GetSortBy() == "title") {
			form.elements["sortby"][1].checked = true;
		} else {
			form.elements["sortby"][0].checked = true;
		}
	}

    var cookie = new Cookie("sws_cust");
    var saved_filter_val = "";
    if (cookie_filter_val_key != "") {
        saved_filter_val = cookie.get(cookie_filter_val_key);
    }
    if (saved_filter_val != "") {
        cbxfilter = form.elements["filter"];
        for (var i = 0; i < cbxfilter.options.length; i++) {
            if (cbxfilter.options[i].value == saved_filter_val) {
                cbxfilter.options[i].selected = true;
            }
        }
    }
	if (object == "location"){
        FilterRooms(form);
    }
	else if (object == "locationdept"){
        FilterRoomsByDept(form);
    }
	else if (object == "student+set"){
        if (GetSortBy() == "title") {
        	FilterStudentSetsByTitle(form);
		} else {
			FilterStudentSetsByCode(form);
		}
    }
	else if (object == "staff"){
        FilterStaff(form);
    }
	else if (object == "module"){
		if (GetSortBy() == "title") {
			FilterModulesByTitle(form);
		} else {
	        FilterModulesByCode(form);
		}
    }
	else if (object == "programme+of+study"){
        if (GetSortBy() == "title") {
			FilterProgrammesByTitle(form);
		} else {
        	FilterProgrammesByCode(form);
		}
    }


    var saved_vals = cookie.getAsArray(cookie_val_key);
    if (saved_vals != null) {
    	var inputelement = form.elements["identifier"];
    	if (inputelement.type != "text") {
			for (var i = 0; i < inputelement.options.length; i++) {
				for (var j = 0; j < saved_vals.length; j++) {
					if (inputelement.options[i].value == saved_vals[j]) {
						inputelement.options[i].selected = true;
						break;
					}
				}
			}
		}
    }
	var saved_weeks = cookie.get("weeks");
    cbxweeks = form.elements["weeks"];
    for (var i = 0; i < cbxweeks.options.length; i++) {
        if (cbxweeks.options[i].value == saved_weeks) {
            cbxweeks.options[i].selected = true;
        }
    }
}


function SetFindStaff(form) {

	var filter = form.elements["filter"].options[form.elements["filter"].selectedIndex].value;

	var staff = form.elements["identifier"].options[form.elements["identifier"].selectedIndex].value;

	var cookie = new Cookie("sws_cust");

	cookie.set("filter",filter);
	cookie.set("staff", staff);
	cookie.save();


}

function GetFindStaff(form) {

    var cookie = new Cookie("sws_cust");

	var staff = cookie.get("staff");
	var filter = cookie.get("filter");

    lbxobject = form.elements["identifier"];
    for (var i = 0; i < lbxobject.options.length; i++) {
        if (lbxobject.options[i].value == staff) {
            lbxobject.options[i].selected = true;
            break;
        }
    }

    lbxobject = form.elements["filter"];
    for (var i = 0; i < lbxobject.options.length; i++) {
        if (lbxobject.options[i].value == filter) {
            lbxobject.options[i].selected = true;
            break;
        }
    }

}


function SetSortBy(form) {

	var sortbycode = form.elements["sortby"][0];

	var cookie = new Cookie("sortby");

	if(sortbycode.checked == true) {
		cookie.set("sortby","code");
	} else {
		cookie.set("sortby","title");
	}
	cookie.save();

}

function GetSortBy() {

	var cookie = new Cookie("sortby");

	if (cookie.get("sortby") == "title") {
		return "title";
	} else {
		return "code";
	}

}


function fixspace(str)
// replaces any spaces in a string with plus signs so it can be accepted by Netscape

{
  var start;
  var newstr;
  start=0;
  newstr="";

  for(var i=0; i<str.length; i++)
  {
    if (str.charAt(i)==" ")
    {
      newstr+=str.substr(start,(i-start))+"+";
      start=i+1;
    }
  }
  newstr+=str.substr(start,(i-start));
  return newstr;
}

// these functions determine the value of the sort by check box and
// filter the list by either code of title accordingly
// the functions called are in the auto-generated filter.js file
function FilterProgrammes(form) {
	if (GetSortBy() == "title") {
		FilterProgrammesByTitle(form);
	} else {
		FilterProgrammesByCode(form);
	}
}

function FilterModules(form) {

	if (GetSortBy() == "title") {
		FilterModulesByTitle(form);
	} else {
		FilterModulesByCode(form);
	}
}

function FilterStudentSets(form) {
	if (GetSortBy() == "title") {
		FilterStudentSetsByTitle(form);
	} else {
		FilterStudentSetsByCode(form);
	}
}


function AddGenWeeks(dy,mo,yr,stwk,enwk,cbxWeeks) {
    var monday;
    var mondaystr;
    var datelen;
    mo = mo - 1;
    monday = new Date(yr, mo, dy);
    enwk ++;
    var j=cbxWeeks.options.length;
    var jinit=j;
	var MonthArray = new Array(11);
	MonthArray [0] = "Jan";
	MonthArray [1] = "Feb";
	MonthArray [2] = "Mar";
	MonthArray [3] = "Apr";
	MonthArray [4] = "May";
	MonthArray [5] = "Jun";
	MonthArray [6] = "Jul";
	MonthArray [7] = "Aug";
	MonthArray [8] = "Sep";
	MonthArray [9] = "Oct";
	MonthArray [10] = "Nov";
	MonthArray [11] = "Dec";
	var DayArray = new Array(6);
	DayArray [0] = "Sun";
	DayArray [1] = "Mon";
	DayArray [2] = "Tue";
	DayArray [3] = "Wed";
	DayArray [4] = "Thu";
	DayArray [5] = "Fri";
	DayArray [6] = "Sat";
//    for(var i=stwk; i<enwk; i++) {
//	    var strDay = DayArray[monday.getDay()];
//	    var strMon = MonthArray[monday.getMonth()];
//	    var strPad = "";
//	    var intDat = monday.getDate();
//	    if (intDat < 10) { strPad = "0" }
//	    var strDat = strPad + intDat.toString();
//	    var strYr = monday.getFullYear().toString();
//	    mondaystr = "w/c " + strDay + " " + strDat + " " + strMon + " " + strYr;
//        if (j == 0) {
//		    cbxWeeks.options[j] = new Option("This Week", "");
//		    monday.setDate(monday.getDate() - 7);
//		    j++;
//        } else {
//		    cbxWeeks.options[j] = new Option(mondaystr, i.toString());
//		    j++;
//        }
//        monday.setDate(monday.getDate() + 7);
//    }
	cbxWeeks.options[0].selected = true;
}





function AddWeeks(strWeekRange, strWeekLabel, cbxWeeks) {

	var intLength = cbxWeeks.options.length;

	cbxWeeks.options[intLength] = new Option(strWeekLabel, strWeekRange);

}

function InsertNextWeekOption(cbxweeks) {

	var date1 = new Date(startdate);
	var date2 = new Date();

	var date1temp = date1.getTime();
	var date2temp = date2.getTime();

	var datediff = date2temp - date1temp;

	week = Math.floor(datediff / (1000 * 60 * 60 * 24 * 7));

	week += 2;

	AddWeeks(week.toString(),"Next Week",cbxweeks);

}

function PrevNextWks(myurl,previous) {

	var query = location.search.substring(1);

	myurl = myurl.replace(/weeks/,"");
	myurl = myurl.replace(/template/,"");
	myurl = myurl.replace(/#/,"%23");

	if (query != "")
	{
		var values = query.split("&");

		for (var i=0; i<values.length; i++)
		{
			var pos = values[i].indexOf('=');
			if (pos == -1) continue;
			var argument = values[i].substring(0,pos);


			if (argument == "t") {
				var template = values[i].substring(pos+1);
			}

			if (argument == "weeks") {


				var weekrange = values[i].substring(pos+1);

				if (weekrange.length < 1) {

					var date1 = new Date(startdate);
					var date2 = new Date();

					var date1temp = date1.getTime();
					var date2temp = date2.getTime();

					var datediff = date2temp - date1temp;


					weekrange = Math.floor(datediff / (1000 * 60 * 60 * 24 * 7));

					weekrange ++;

					if (weekrange < 1) {
						weekrange = 1;
					} else {
						if (weekrange > 52) {
							weekrange = 52;
						}
					}

				}

				weekrange = weekrange + ";";

				var weeklen = weekrange.length;
				var i = 0;

				var stweek;
				var enweek;

				var current = "";

				for (var j=i; j<weeklen; j++) {
					if (weekrange.substr(j,1) == ";") {
						break;
					}
					current = current + weekrange.substr(j,1);
				}

				if (current.length < 3) {
					stweek = parseInt(current);
					enweek = stweek;
				}
				else {
					if (current.length == 3) {
						stweek = parseInt(current.substr(0,1));
						enweek = parseInt(current.substr(2,1));
					}
					else {
						if (current.length == 4) {
							stweek = parseInt(current.substr(0,1));
							enweek = parseInt(current.substr(2,2));
						}
						else {
							stweek = parseInt(current.substr(0,2));
							enweek = parseInt(current.substr(3,2));
						}
					}
				}

				if (previous == true) {
					stweek = stweek -1;
					if (stweek < 1) stweek = 52;
				} else {
					stweek = stweek + 1
					if (stweek > 52) stweek = 1;
				}

				window.location = myurl + "&weeks="+ stweek + "&template=" + template;

				break;

			}
		}
	}
}
