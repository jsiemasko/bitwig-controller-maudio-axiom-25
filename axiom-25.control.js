loadAPI(10);

host.defineController("M-Audio", "Axiom 25", "1.0", "436eb006-523d-4fd4-adf1-431af7803e53");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["USB Axiom 25"], ["USB Axiom 25"]);
host.defineSysexIdentityReply("F0 7E 7F 06 02 00 20 08 63 0E 18 03 20 31 30 30 F7");

var ccToMacroNum = {
    71: 0,
    74: 1,
    84: 2,
     7: 3,
    91: 4,
    93: 5,
     5: 6,
    10: 7
};

var transportCC = {
    LOOP: 20,
    REW: 21,
    FF: 22,
    STOP: 23,
    PLAY: 24,
    REC: 25
};

function init() {
    host.getMidiInPort(0).setMidiCallback(onMidi);
    setupSysex();    
    transport = host.createTransport();
    cursorTrack = host.createCursorTrack(2, 0);
    cursorDevice = cursorTrack.getPrimaryDevice();
    cursorControlPage = cursorDevice.createCursorRemoteControlsPage(8);
    createNoteInputs();
    setIndications();
}

function setupSysex()
{
    // Print Sysex ID response.
    host.getMidiInPort(0).setSysexCallback(function(data) {println(data);});
    println("Sysex ID:");
    sendSysex("F0 7E 7F 06 01 F7");
}

/*
 * Set the mapping indicator on all macros
 */
function setIndications()
{
    var numOfMacros = 8;
    for(i = 0; i < numOfMacros; i++)
        cursorControlPage.getParameter(i).setIndication(true);
}

/*
 * Create the note inputs for Keys and Pads
 */
function createNoteInputs()
{
    var noteInput = host.getMidiInPort(0).createNoteInput("Keys",
        "80????", "90????", "B001??", "B002??", "B00B??", "B040??", "C0????", "D0????", "E0????");
    noteInput.setShouldConsumeEvents(false);

    var padInput = host.getMidiInPort(0).createNoteInput("Pads",
        "89????", "99????", "B901??", "B902??", "B90B??", "B940??", "C9????", "D9????", "E9????");
    padInput.setShouldConsumeEvents(false);
}

/*
 * Called on every MIDI message that is not used for a note input 
 */
function onMidi(status, data1, data2) {
    if (isChannelController(status)) {        
        var macroNum = ccToMacroNum[data1];
        
        if(macroNum != undefined)
        {
            incrementEncoder(macroNum, data2);
        }
        else
        {
            processTransportButton(data1);
        }
    }
}

/*
 * Handles incrementing and decrementing the encoder.
 * Since we are using the '2’s Compliment from 64 / Relative (Binary Offset)' encoder mode
 * Anything above 64 is an increment and anything below it is a decrement.
 */
function incrementEncoder(macroNum, ccValue)
{
    var midpoint = 64;
    var resolution = 64;
    var amount = ccValue - midpoint;
    cursorControlPage.getParameter(macroNum).inc(amount, resolution)
}

/*
 * Process the transport buttons
 */
function processTransportButton(cc)
{
    switch (cc) {
        case transportCC.LOOP:
            cursorDevice.isWindowOpen().toggle();
            break;
        case transportCC.REW:
            cursorTrack.selectPrevious();
            break;
        case transportCC.FF:
            cursorTrack.selectNext();
            break;
        case transportCC.STOP:
            transport.stop();
            break;
        case transportCC.PLAY:
            transport.play();
            break;
        case transportCC.REC:
            transport.record();
            break;
    }
}

/*
 * Called when the script exits
 */
function exit() {
}
