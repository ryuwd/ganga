// This file is part of the jTaskMonitoring software
// Copyright (c) CERN 2010
//
// Author: Lukasz Kokoszkiewicz [lukasz@kokoszkiewicz.com , lukasz.kokoszkiewicz@cern.ch]
//
// History:
// 18.05.2010 Created
//

function ControlsUpdate() {
    this.userDropdown_update = function() {
        var thisRef = this;
        $('#userSelect_dropdown option').each( function(i){
            $(this).removeAttr('selected');
            if ($(this).val() == thisRef.Data.user) $(this).attr('selected','selected');
        });
    };
    
    this.generateUserDropdownOptions = function() {
        // Generate users options
        var newOption = $('<option></option>').attr('value','').html('');
        $('#userSelect_dropdown').empty();
        $('#userSelect_dropdown').append(newOption);
        for (i in thisRef.Data.mem.users) {
            newOption = $('<option></option>').attr('value',this.Data.mem.users[i]).html(this.Data.mem.users[i]);
            $('#userSelect_dropdown').append(newOption);
        }
        
        $('#userSelect_dropdown').unbind('change').change( function() { thisRef.userDropDown_Change(this) });
        this.userDropdown_update();
    };
    
    this.fromTill_update = function() {
        if (this.Data.from == 0) $('#from').datepicker('setDate',null);
        else $('#from').datepicker('setDate',$.datepicker.parseDate('@',(this.Data.from)));
        if (this.Data.till == 0) $('#till').datepicker('setDate',null);
        else $('#till').datepicker('setDate',$.datepicker.parseDate('@',(this.Data.till)));
    };
    
    this.timeRange_update = function() {
        var thisRef = this;
        var timestampNow, timestampThen, timeThen;
        var pastArr = {
            'lastDay': (86400*1000),
            'last2Days': (86400*1000*2),
            'last3Days': (86400*1000*3),
            'lastWeek': (86400*1000*7),
            'last2Weeks': (86400*1000*14),
            'lastMonth': (86400*1000*31)
        };
        $('#timeRange option').each( function(i){
            $(this).removeAttr('selected');
            if ($(this).val() == thisRef.Data.timeRange) $(this).attr('selected','selected');
        });
        
        if (thisRef.Data.timeRange) {
            timestampNow = $.datepicker.formatDate('@', new Date());
            timestampThen = $.datepicker.parseDate('@',(timestampNow - pastArr[thisRef.Data.timeRange]));
            timeThen = 'Records from '+$.datepicker.formatDate('yy-mm-dd', timestampThen);
        }
        else {
            timeThen = 'Disabled';
        }
        $('#timeRange').attr('title',timeThen);
    };
    
    this.userRefresh_update = function() {
        var thisRef = this;
        $('#refresh option').each( function(i){
            $(this).removeAttr('selected');
            if ($(this).val() == thisRef.Data.refresh) $(this).attr('selected','selected');
        });
    };
    
    this.breadcrumbs_update = function() {
        var thidRef = this;
        var output = '<span class="bold">Job monitoring : </span>';
        // id=breadcrumbs
        if (this.Data.user) {
            if (this.Data.tid) {
                // show jobs
                output += '<a>Users List</a> &raquo; <span class="bold">' + this.Data.user + '</span> &raquo; <a>Jobs</a> &raquo; ' + this.Data.tid;
            }
            else {
                // show tasks
                output += '<a>Users List</a> &raquo; <span class="bold">' + this.Data.user + '</span> &raquo; Jobs';
            }
        }
        else {
            // show users
            output += 'Users List';
        }
        
        $('#breadcrumbs').html(output);
        
        // Set up events
        $('#breadcrumbs a').click( function() { thisRef.breadcrumbs_click(this) });
    };
}
