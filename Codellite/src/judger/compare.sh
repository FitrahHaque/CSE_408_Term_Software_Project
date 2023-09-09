diff -w $1 $2 >/dev/null;REPLY=$?
if [ ${REPLY} -eq 0 ]
then
         echo "1"
else
         echo "0" 
fi
#echo "test"
# if diff -q $1 $2; then 
# echo "1"
# echo diff $1 $2 > tmp.txt
# else
# echo "0"
# fi