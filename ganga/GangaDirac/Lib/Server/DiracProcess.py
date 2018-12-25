#!/usr/bin/env python
import sys
import errno
import socket
import traceback
import StringIO
HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 65452        # Port to listen on (non-privileged ports are > 1023)
import time
def output(data):
    print data

def closeSocket():
    sc = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sc.connect((HOST, PORT))
    sc.sendall(b'close server')
    sc.close()
codeOut = StringIO.StringIO()
codeErr = StringIO.StringIO()
end_trans = '###END-TRANS###'
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#Put in a try/except in case there is an orphaned process. We can shut it down first and start afresh
try:
    s.bind((HOST, PORT))
except socket.error as serr:
    if serr.errno == errno.EADDRINUSE:
        closeSocket()
        s.bind((HOST, PORT))

s.listen(1024)
conn, addr = s.accept()
#print 'connected by ', addr
while True:
    out = ''
    while end_trans not in out:
            data = conn.recv(1024)
            if not data:
                s.listen(1024)
                conn, addr = s.accept()
#                print 'connected by ', addr
                data = conn.recv(1024)
            out += data
            if data == 'close server':
                break                 
#    print 'data: ', out
    if out == 'close server':
        break
    cmd = str(out)
    codeOut = StringIO.StringIO()
    codeErr = StringIO.StringIO()
    sys.stdout = codeOut
    sys.stderr = codeErr
    try:
        print(eval(cmd))
    except:
        try:
            exec(cmd)
        except:
            print("Exception raised executing command (cmd) '%s'\n" % cmd)
            print(traceback.format_exc())
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
#    print 'stdout: ', codeOut.getvalue()
    if codeOut.getvalue()=='':
        conn.sendall('some stuff')
    else:
        conn.sendall(codeOut.getvalue()+'###END-TRANS###')
#    print 'more arse some processing, going to sleep for some reason'
#            print 'res: ', res
    if not data:
        break
#            if not res == '':
#                conn.sendall(repr(res))

print 'broken'

conn.close()
