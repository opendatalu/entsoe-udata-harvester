alert() {
    if command -v alert.sh 1>/dev/null; then
        alert.sh "$@"
    fi 
}
node.exe --experimental-specifier-resolution=node daily.js >> ./log.txt 2>&1 || alert "Error entsoe" log.txt