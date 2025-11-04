#!/bin/bash

# ========================================
# Switch API Environment Script
# ========================================
# Usage:
#   bash switch-env.sh local    # Switch to localhost
#   bash switch-env.sh remote   # Switch to hakunamatata.my.id

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔄 HRIS API Environment Switcher${NC}"
echo -e "${BLUE}========================================${NC}"

if [ "$1" == "local" ]; then
    echo -e "\n${YELLOW}Switching to LOCALHOST mode...${NC}"
    cp .env.local .env
    echo -e "${GREEN}✅ Switched to LOCALHOST${NC}"
    echo -e "${BLUE}API URL: http://localhost:8000/api${NC}"
    echo -e "\n${YELLOW}⚠️  Make sure Laravel backend is running:${NC}"
    echo -e "   ${GREEN}php artisan serve${NC}"
    
elif [ "$1" == "remote" ]; then
    echo -e "\n${YELLOW}Switching to REMOTE mode...${NC}"
    cp .env.remote .env
    echo -e "${GREEN}✅ Switched to REMOTE${NC}"
    echo -e "${BLUE}API URL: https://hakunamatata.my.id/api${NC}"
    
else
    echo -e "\n${RED}❌ Invalid argument!${NC}"
    echo -e "\n${YELLOW}Usage:${NC}"
    echo -e "  ${GREEN}bash switch-env.sh local${NC}   # Switch to localhost:8000"
    echo -e "  ${GREEN}bash switch-env.sh remote${NC}  # Switch to hakunamatata.my.id"
    exit 1
fi

echo -e "\n${YELLOW}📝 Restart dev server for changes to take effect:${NC}"
echo -e "   ${GREEN}npm run dev${NC}"
echo -e "${BLUE}========================================${NC}\n"
