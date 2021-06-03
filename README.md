# node-red-contrib-heap-dump
 A Node Red node to create a heap dump file.

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-heap-dump
```

## Support my Node-RED developments

Please buy my wife a coffee to keep her happy, while I am busy developing Node-RED stuff for you ...

<a href="https://www.buymeacoffee.com/bartbutenaers" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy my wife a coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Node Usage
When talking about ***garbage collections*** in NodeJS, the collections are executed in the V8. That V8 is Google's Javascript engine (written in C++), that is a.o. used to run Node.js.

In normal circumstances, the V8 engine will cleanup memory (using garbage collections) as soon as necessary.  But sometimes the garbage collections run frequently, but they don't cleanup all *unused data* from memory.  Some memory keeps being allocated, despite it is not being used anymore.  As a result, the memory usage start increasing...  This situation is called ***memory leakage***.

To find the root cause of a memory leak, you will need to compare multiple ***heap dumps*** (e.g. using the Chrome developer tools).  This analysis process isn't explained here, because tons of tutorials about it can be found on the internet.

A heap dump is a snapshot of the NodeJs heap memory at a certain moment in time.  This node simplifies the process of creating heap, since it is fully integrated in your Node-Red flow:

1. Specify a directory in the node's config screen, where the heap dump file `<timestamp>.heapsnapshot` will be generated.

2. Inject a message into the heap dump node.  When no directory has been specified in step 1, a directory can be specified in the input message (using the `msg.directory` field).

3. The node status will indicate that the node is currently creating a heap dump:

    ![Trigger heap dump](https://raw.githubusercontent.com/bartbutenaers/node-red-contrib-heap-dump/master/images/heap_dump.png)

4. When the heap dump is finished, the node status will display the full path of the heap dump file:

    ![Heap dump done](https://raw.githubusercontent.com/bartbutenaers/node-red-contrib-heap-dump/master/images/heap_dump_done.png)

5. Execute some actions in Node-Red, preferable actions that you suspect causing the memory leak.

6. Create on or more extra heap dumps, i.e. repeat steps 1 to 4 a number of times.

7. Compare the heap dumps, e.g. using Chrome developer tools.

8. Analyze the delta between the heap dumps ...

Example flow:
```
[{"id":"194b13aa.03f90c","type":"heap-dump","z":"15244fe6.9ae87","directory":"/tmp/bart","createDir":true,"name":"","x":1120.1668167114258,"y":325.33335304260254,"wires":[[]]},{"id":"535cf64a.826208","type":"inject","z":"15244fe6.9ae87","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":945.166748046875,"y":325.66668701171875,"wires":[["194b13aa.03f90c"]]}]
```
