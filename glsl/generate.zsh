ls main_* | while read -r line
do
NAME=${line/main_/merged_}
cat hsv_support.glsl correctFilter.glsl $line > generated/$NAME
done

