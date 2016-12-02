#!/bin/sh
template_err_file=$(find . -name "expected_test_err")
template_out_file=$(find . -name "expected_test_out")
test_script=$(find . -name "formal-console-test.js")

result=0;

rm -f test_out test_err template_out_filtered test_out_filtered template_err_filtered test_err_filtered

$test_script >> test_out 2>> test_err

grep -v "    at " $template_out_file > template_out_filtered
grep -v "    at " test_out > test_out_filtered
cmp template_out_filtered test_out
if [ $? -ne 0 ]; then
  result=1
  echo "💩 test 1 failed"
  echo "expected:"
  cat template_out_filtered
  echo "actually:"
  cat test_out_filtered
else
  echo "✅ test 1 passed"
fi

grep -v "    at " $template_err_file > template_err_filtered
grep -v "    at " test_err > test_err_filtered
cmp template_err_filtered test_err_filtered
if [ $? -ne 0 ]; then
  result=1
  echo "💩 test 2 failed"
  echo "expected:"
  cat template_err_filtered
  echo "actually:"
  cat test_err_filtered
else
  echo "✅ test 2 passed"
fi

rm -f test_out test_err template_out_filtered test_out_filtered template_err_filtered test_err_filtered

exit $result
