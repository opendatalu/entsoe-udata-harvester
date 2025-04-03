alert() {
    if command -v alert.sh 1>/dev/null; then
        alert.sh "$@"
    fi 
}
node_cmd="node"
if [[ "$OSTYPE" == "cygwin" ]]; then
        node_cmd="node.exe"
elif [[ "$OSTYPE" == "msys" ]]; then
        node_cmd="node.exe"
elif [[ "$OSTYPE" == "win32" ]]; then
        node_cmd="node.exe"
fi

$node_cmd daily.js >> ./log.txt 2>&1 || alert "Error entsoe" log.txt