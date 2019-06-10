(function(){
    var ritmsNoSla = [];
    var ritm = new GlideRecord("sc_req_item");
    ritm.query();
    while (ritm.next()) {
        var taskSla = new GlideAggregate("task_sla");
        taskSla.addAggregate("COUNT");
        taskSla.addQuery("task", ritm.sys_id.toString());
        taskSla.query();
        if(taskSla.next() && taskSla.getAggregate('COUNT') == 0){
            ritmsNoSla.push(ritm.sys_id.getDisplayValue());
        }
    }
    return ritmsNoSla;
})();