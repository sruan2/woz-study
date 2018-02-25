import json
import sys
import unicodedata

def main(infile, uid, outfile):
    data = json.load(open(infile))
    for log in data:
        if log['user_id']['$oid'] == uid:
            lines = log['history']
            with open(outfile, 'w') as f:
                for line in lines:
                    f.write(line['sender'] + ': ' + line['contents'].encode('ascii', 'ignore') + '\n')
            print("Output successful.")
            return
    print("Could not find user ID.")


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print('Argument 1 must be json data file. Argument2 must be the user\'s ID. Argument 3 must be the output file name.')
    else:
        main(sys.argv[1], sys.argv[2], sys.argv[3])