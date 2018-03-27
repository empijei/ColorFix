import lief
import sys
if len(sys.argv)<3:
    print "Usage script.py ELF_FILE SEGMENT_CONTENT_FILE "
    exit(0)
binary = lief.parse(sys.argv[1])

segment = binary.
segment.flags = lief.ELF.SEGMENT_FLAGS.R | lief.ELF.SEGMENT_FLAGS.W | lief.ELF.SEGMENT_FLAGS.X
segment.content = newSegment
segment = binary.replace(segment, binary[lief.ELF.SEGMENT_TYPES.NOTE])

binary.write(sys.argv[3])
