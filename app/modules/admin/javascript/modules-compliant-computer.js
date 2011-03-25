    
$(document).ready(function() {
    if (typeof moduleID != 'undefined') {
        makeAPICall('GET', 'admin','getconfigdata', { 'v':1,'type':'module','module':moduleID}, processModuleData);
    
        $('#adminForm').submit(function(e) {
            var params = { 'v':1, 'type':'module', 'module':moduleID, 'data':{}};
            
            $('#adminForm [section]').map(function() { 
                var section = $(this).attr('section');
                if (typeof params.data[section] == 'undefined') {
                    params.data[section] = {};
                }
                
                if ($(this).attr('type')!='checkbox' || this.checked) {
                    params.data[section][$(this).attr('name')] = $(this).val();
                }
            });
            
            makeAPICall('POST','admin','setconfigdata', params, function() { alert('Configuration saved') });
            return false;
        });
    } else {
        //overview
        $('#adminForm').submit(function(e) {
            var params = { 'v':1, 'type':'module', 'section':'overview', 'data':{}};
            var re;
            var formValues = {};
            $.each($(this).serializeArray(), function(index,value) {
                if (re = value.name.match(/(.*)\[(.*)\]/)) {
                    if (typeof params.data[re[1]]=='undefined') {
                        params.data[re[1]] = {}
                    }
                    params.data[re[1]][re[2]] = $(this).val();                    
                }
            });

            makeAPICall('POST','admin','setconfigdata', params, function() { alert('Configuration saved') });
            return false;
        });
    }
    
});


    
function processModuleData(data) {
    $('#moduleDescription').html(data.description);
    $("#adminFields").html('');
    $.each(data, function(section, sectionData) {
        $.each(sectionData.fields, function(key, data) {
            data.section = section;
            $("#adminFields").append(createFormFieldListItem(key, data));
        });
    });
    
}
    