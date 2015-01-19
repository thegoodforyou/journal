//populate the dropdown boxes with activity types, and submission types

var actSelect = document.getElementById("actSelect");
var actlabels = ["What are you doing?", "How do you feel?", "Note to self:", "Add to ToDo list:", "Work:", "Housework:", "Homework:", "Food and Drink:", "Exercise:", "Hygiene:", "Income and Spending:", "Journal:"];
var actvalues = ["General", "Feeling", "Note", "ToDo", "Work", "Housework", "Homework", "Diet", "Exercise", "Hygiene", "Finance", "Journal"];
for (var i = 0; i < actlabels.length; i++) {
	var opt = actlabels[i];
	var val = actvalues[i];
	var el = document.createElement("option");
	el.textContent = opt;
	el.value = val;
	actSelect.appendChild(el);
}

//all submision types

var subSelect = document.getElementById("subSelect");
var sublabels = ["Submit", "Time", "Location", "Reminder", "Schedule", "Alarm"];
var subvalues = ["submit", "time", "location", "reminder", "schedule", "alarm"];

//specialized sumbission types

var generalsublabels = ["Submit", "Time", "Location", "Reminder", "Schedule", "Alarm"];
var generalsubvalues = ["submit", "time", "location", "reminder", "schedule", "alarm"];
var feelingsublabels = ["Submit"];
var feelingsubvalues = ["submit"];
var notesublabels = ["Submit", "Reminder", "Schedule", "Alarm"];
var notesubvalues = ["submit", "reminder", "schedule", "alarm"];

for (var i = 0; i < sublabels.length; i++) {
	var subopt = sublabels[i];
	var subval = subvalues[i];
	var subel = document.createElement("option");
	subel.textContent = subopt;
	subel.value = subval;
	subSelect.appendChild(subel);

}

//set the submission types based on the activity type

function setSubtypes() {

	var subSelect = document.getElementById("subSelect");

	var generalsublabels = ["Submit", "Time", "Location", "Reminder", "Schedule", "Alarm"];
	var generalsubvalues = ["submit", "time", "location", "reminder", "schedule", "alarm"];
	var feelingsublabels = ["Submit"];
	var feelingsubvalues = ["submit"];
	var notesublabels = ["Submit", "Reminder", "Schedule", "Alarm"];
	var notesubvalues = ["submit", "reminder", "schedule", "alarm"];

	subTypes = document.getElementById("actSelect").value;

	switch (subTypes) {
	case "General":
	case "Finance":
	case "Exercise":
	case "Diet":
	default:
		sublabels = generalsublabels;
		subvalues = generalsubvalues;
		break;
	case "Note":
	case "ToDo":
		sublabels = notesublabels;
		subvalues = notesubvalues;
		break;
	case "Feeling":
	case "Journal":
		sublabels = feelingsublabels;
		subvalues = feelingsubvalues;
	};

	for (var i = 0; i < sublabels.length; i++) {
		var subopt = sublabels[i];
		var subval = subvalues[i];
		var subel = document.createElement("option");
		subel.textContent = subopt;
		subel.value = subval;
		subSelect.appendChild(subel);
	};
	var subNode = document.getElementById("subSelect");

}

//when an activity type changes, change both the placeholder of the input box, and the available submission types

function changeActivity() {

	input1.value = "";
	var placeholdervalue = document.getElementById("actSelect").value;
	var placeholderindex = actvalues.indexOf(placeholdervalue)
	document.getElementById("input1").placeholder = actlabels[placeholderindex].valueOf();

	var subNode = document.getElementById("subSelect");
	while (subNode.firstChild) {
		subNode.removeChild(subNode.firstChild);
	};

	setSubtypes();
	document.getElementById("submit").value = "Submit";

}

//change the text on the Submit button base on the submission type selected

function changeSubmit() {

	var submitvalue = document.getElementById("subSelect").value;
	var submitindex = subvalues.indexOf(submitvalue)
	document.getElementById("submit").value = sublabels[submitindex].valueOf();

}




( function() {

		// Some global variables (database, references to key UI elements)
		var db,
		    input,
		    journaltable;

		//log the datetime in milliseconds

		var jsdatevalue = new Date();
		var unixdatevalue = jsdatevalue.getTime();

		//var datevalue=Math.round(new Date().getTime()/1000.0)

		//var datevalue=encodeURIComponent(Date())

		var typevalue = document.getElementById("actSelect").value
		var journalentryvalue = document.getElementById("input1").value
		var subvalue = document.getElementById("submit").value
		var feelingvalue = document.getElementById("feeling").value
		var modifiedvalue = 'false'
		var modifiedbyvalue = '0'
		var deletedvalue = 'false'
		var deletedbyvalue = '0'
		


		databaseOpen(function() {

			input = document.getElementById("input1");
			journaltable = document.getElementById("journalTable");
			journaltablebody = document.getElementById("journalTableBody");
			document.body.addEventListener('submit', onSubmit);
			document.getElementById('submit').addEventListener('click', onSubmit);
			document.body.addEventListener('click', onClick);
			databaseJournalEntriesGet(renderAllJournalEntries);
		});

		/*function onClick(e) {

		 // We'll assume any element with an ID attribute
		 // is a journal item. Don't try this at home!
		 if (e.target.hasAttribute('id')) {

		 // Note because the id is stored in the DOM, it becomes
		 // a string so need to make it an integer again
		 databaseJournalEntriesDelete(parseInt(e.target.getAttribute('id'), 10), function() {
		 databaseJournalEntriesGet(renderAllJournalEntries);
		 });
		 }
		 }*/
		
		function onClick(e) {

		 // We'll assume any element with an ID attribute
		 // is a journal item. Don't try this at home!
		 
		
		 // Note because the id is stored in the DOM, it becomes
		 // a string so need to make it an integer again
		 databaseJournalEntriesIndex(e.target.innerHTML, renderAllJournalEntries);
		 
		 }

		function renderAllJournalEntries(journalentries) {
			var html = '';
			journalentries.forEach(function(journal) {
				html += journalToHtml(journal);
			});
			journaltablebody.innerHTML = html;
		}

		function journalToHtml(journal, type) {
			// Add some text to the new cells:

			//convert unix time to local time
			// create a new javascript Date object based on the timestamp
			// multiplied by 1000 so that the argument is in milliseconds, not seconds
			var date = new Date(journal.timeStamp);
			// year part from the timestamp
			var year = date.getFullYear();
			// minutes part from the timestamp
			var month = (1 + date.getMonth());
			// seconds part from the timestamp
			var monthdate = date.getDate()

			// hours part from the timestamp
			var hours = date.getHours();
			// minutes part from the timestamp
			var minutes = "0" + date.getMinutes();
			// seconds part from the timestamp
			var seconds = "0" + date.getSeconds();

			// will display time in 10:30:23 format
			var formattedTime = year + "/" + month + "/" + monthdate + " " + hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
			
			return '<tr><td>' + formattedTime + '</td><td class="hidden journalType">' + journal.type + '</td><td>' + journal.journalentry + '</td><td class="hidden">' + journal.sub + '</td><td class="hidden">' + journal.feeling + '</td><td class="hidden">' + journal.modified + '</td><td class="hidden">' + journal.modifiedby + '</td><td class="hidden">' + journal.deleted + '</td><td class="hidden">' + journal.deletedby + '</td></tr>';
		}

		function onSubmit(e) {
			e.preventDefault();
			databaseJournalEntriesAdd(document.getElementById("actSelect").value, input.value, document.getElementById("submit").value, document.getElementById("feeling").value, modifiedvalue, modifiedbyvalue, deletedvalue, deletedbyvalue, function() {
				// After new journalentries have been added - rerender all the journalentries
				databaseJournalEntriesGet(renderAllJournalEntries);
				input1.value = "";
				feeling.value = "0";
				//congratulate the user

				changeActivity();

				alert("GOOD for you :-)");
				location.reload();
			});
		}

		function databaseOpen(callback) {
			// Open a database, specify the name and version
			var version = 1.2;
			var request = indexedDB.open('journalentries', version);

			// Run migrations if necessary
			request.onupgradeneeded = function(e) {
				db = e.target.result;
				e.target.transaction.onerror = databaseError;
				var oStore = db.createObjectStore('journal', { keyPath : 'timeStamp'});
				//var transaction = e.target.transaction(['journal'], 'readwrite');
			    oStore.createIndex("type", "type", {unique: false});
				
				
			};

			request.onsuccess = function(e) {
				db = e.target.result;
				callback();
			};
			request.onerror = databaseError;
		}

		function databaseError(e) {
			console.error('An IndexedDB Error has occurred', e);
		}

		function databaseJournalEntriesAdd(type, journalentry, sub, feeling, modified, modifiedby, deleted, deletedby, callback) {
			var transaction = db.transaction(['journal'], 'readwrite');
			var store = transaction.objectStore('journal');
			
			var request = store.put({
				//unixdate: unixdate,
				type : type,
				journalentry : journalentry,
				sub : sub,
				feeling : feeling,
				modified : modified,
				modifiedby : modifiedby,
				deleted : deleted,
				deletedby : deletedby,
				timeStamp : Date.now()

			});

			transaction.oncomplete = function(e) {
				callback();
			};
			request.onerror = databaseError;
		}

		function databaseJournalEntriesGet(callback) {
			var transaction = db.transaction(['journal'], 'readonly');
			var store = transaction.objectStore('journal');

			// Get everything in the store
			var keyRange = IDBKeyRange.lowerBound(0);
			var cursorRequest = store.openCursor(keyRange);

			// This fires once per row in the store, so for simplicity
			// collect the data in an array (data) and send it pass it
			// in the callback in one go
			var data = [];
			cursorRequest.onsuccess = function(e) {
				var result = e.target.result;

				// If there's data, add it to array
				if (result) {
					//unlike the original app, we use unshift rather than push, so that data is prepended rather than appended
					data.unshift(result.value);
					result.continue();

					// Reach the end of the data
				} else {
					callback(data);
				}
			};
		}

		function databaseJournalEntriesDelete(id, callback) {
			var transaction = db.transaction(['journal'], 'readwrite');
			var store = transaction.objectStore('journal');
			var request = store.delete(id);
			transaction.oncomplete = function(e) {
				callback();
			};
			request.onerror = databaseError;
		}


		function databaseJournalEntriesIndex(type, callback) {
			
			var transaction = db.transaction(["journal"]);
        		var store = transaction.objectStore("journal");
			var index = store.index("by_type");
			var request = index.getKey(type);
			var data = [];
			request.onsuccess = function(e) {
				var result = e.target.result;

				// If there's data, add it to array
				if (result) {
					//unlike the original app, we use unshift rather than push, so that data is prepended rather than appended
					data.unshift(result.value);
					result.continue();

					// Reach the end of the data
				} else {
					callback(data);
				}
			};
          //}
        //};
		}

	}());


