var controller:Controller;

loadAPI(11);
host.defineController("Behringer", "CMD LC-1", "1.0.0", "2c4aca7d-9a80-4284-838a-391dd6c8290e", "Adrian Bradfield");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["CMD LC-1"], ["CMD LC-1"]);

function init():void{
    controller = new Controller();
    controller.init();
}

function exit():void{
    controller.exit();
}