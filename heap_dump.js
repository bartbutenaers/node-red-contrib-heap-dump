/**
 * Copyright 2018 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 module.exports = function(RED) {
    "use strict";
    var fs = require("fs-extra");
    var path = require("path");
    var heapdump = require('heapdump');

    function HeapDumpNode(config) {
        RED.nodes.createNode(this,config);
        this.directory = config.directory
        this.createDir = config.createDir;

        var node = this;
        
        function checkDirectoryExists(directory) { 
            try {
                fs.statSync(directory);
                return true;
            } 
            catch(e) {
                return false;
            }
        }    
        
        this.on("input",function(msg) {   
            var directory = node.directory || msg.directory;  
            
            node.status({fill:"blue",shape:"dot",text:"Analyzing"});

            if (!directory) {
                node.error("When no directory specified in node config, it should be specified in msg.directory");
                node.status({fill:"red",shape:"dot",text:"No directory"});
                return;
            } 

            if (!checkDirectoryExists(directory) && !node.createDir) {
                node.error("The directory doesn't exist, and the node config specifies not to create it");
                node.status({fill:"red",shape:"dot",text:"Invalid directory"});
                return;
            }

            // Make sure the directory exists, or create it when it doesn't exist yet
            fs.ensureDir(directory, function(err) {
                if (err) { 
                    node.error("Error creating directory: " + err.toString());
                    node.status({fill:"red",shape:"dot",text:"Directory failed"});
                    return;     
                } 
                
                // Now the directory exists, so let's compose a filename 
                var fileName = Date.now() + ".heapsnapshot";
                
                // Compose the full file path (with the correct OS directory separator in between)
                var fullPath = path.join(directory, fileName);
                
                node.status({fill:"blue",shape:"dot",text:"Creating dump"});
                
                // Write the heap dump to the file
                heapdump.writeSnapshot(fullPath, function(err, filename) {
                    if (err) { 
                        node.error("Error creating heap dump: " + err.toString());
                        node.status({fill:"red",shape:"dot",text:"Dump failed"});
                        return;     
                    } 
                    
                    node.log('Heap dump has been written to ' + filename);
                    node.status({fill:"blue",shape:"dot",text:filename});
                });
            });
        });
        
        node.on("close", function() {
            // TODO how to abort dump ???
        })
    }

    RED.nodes.registerType("heap-dump",HeapDumpNode);
}
