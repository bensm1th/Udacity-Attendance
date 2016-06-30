/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var model = {
        getAttendance: function() {
            return JSON.parse(localStorage.attendance);
        },
        updateAttendance: function(obj) {
            localStorage.attendance = JSON.stringify(obj);
        }
    };
    var controller =    {
        updateChecksInModel: function() {
            $('tbody input').click(function() {
                var studentRows = $('tbody .student'),
                    attendance = {};
                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                        $allCheckboxes = $(this).children('td').children('input'),
                        arr1 = [];
                    $allCheckboxes.each(function(i) {                        
                        arr1.push($(this).prop('checked'));
                        if (arr1.length === 12) {
                            attendance[name] = arr1;
                        }
                    });
                });
                model.updateAttendance(attendance);
                view.renderMissed();
            });
        },
        countDaysMissed: function(name) {
            var attendance = model.getAttendance(),
                missing = 0,
                record = attendance[name];
            record.forEach(function(e) {
                missing += (!e) ? 1:0;
            });
            return missing;
        },
        getNames: function() {
            return Object.keys(model.getAttendance());
        },
        getAttendance: function() {
            return model.getAttendance();
        }
    };
    var view = {
        renderMissed: function() {
            var names = controller.getNames();
            names.forEach(e=> {
                var days = controller.countDaysMissed(e);
                var target = $('tbody :contains( ' + e + ') .missed-col');
                $(target).text(days);
            });
        },
        addChecks: function() {
            var attendance = controller.getAttendance();
            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');
                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });
        }
    };
    view.addChecks();
    view.renderMissed();
    controller.updateChecksInModel();
}());
