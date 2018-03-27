import lief
import sys
if len(sys.argv)<4:
    print "Usage script.py ELF_FILE SEGMENT_CONTENT_FILE OUTPUT_FILE"
    exit(0)
binary = lief.parse(sys.argv[1])
newSegment = map(ord,list(open(sys.argv[2]).read(999999).replace("AAAABBBB","\x00")))
print newSegment

segment = lief.ELF.Segment()
segment.type = lief.ELF.SEGMENT_TYPES.LOAD
segment.flags = lief.ELF.SEGMENT_FLAGS.R | lief.ELF.SEGMENT_FLAGS.W 
segment.content = newSegment
segment = binary.replace(segment, binary[lief.ELF.SEGMENT_TYPES.NOTE])

binary.write(sys.argv[3])
