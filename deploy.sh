#!/bin/bash

################################################################################
# Canton Mutual Financial Limited - AWS部署脚本
# 
# 用途：自动化部署Canton Financial网站到AWS EC2
# 作者：Canton Financial IT Team
# 日期：2024-12-17
# 版本：1.0
################################################################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必需的命令
check_requirements() {
    log_info "检查系统要求..."
    
    commands=("node" "npm" "pnpm" "git")
    for cmd in "${commands[@]}"; do
        if ! command -v $cmd &> /dev/null; then
            log_error "$cmd 未安装，请先安装"
            exit 1
        fi
    done
    
    # 检查Node.js版本
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js版本过低，需要18.x或更高版本"
        exit 1
    fi
    
    log_info "系统要求检查通过 ✓"
}

# 检查环境变量
check_env_vars() {
    log_info "检查环境变量..."
    
    required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "SMTP_HOST"
        "SMTP_PORT"
        "SMTP_USER"
        "SMTP_PASS"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_error "缺少以下环境变量："
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        log_error "请在.env文件中配置或通过export设置"
        exit 1
    fi
    
    log_info "环境变量检查通过 ✓"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    pnpm install --frozen-lockfile
    log_info "依赖安装完成 ✓"
}

# 数据库迁移
run_database_migration() {
    log_info "执行数据库迁移..."
    pnpm db:push
    log_info "数据库迁移完成 ✓"
}

# 构建项目
build_project() {
    log_info "构建生产版本..."
    pnpm run build
    log_info "构建完成 ✓"
}

# 启动应用（使用PM2）
start_application() {
    log_info "启动应用..."
    
    # 检查PM2是否已安装
    if ! command -v pm2 &> /dev/null; then
        log_warn "PM2未安装，正在安装..."
        npm install -g pm2
    fi
    
    # 停止旧进程（如果存在）
    pm2 delete canton-financial 2>/dev/null || true
    
    # 启动新进程
    pm2 start dist/index.js --name canton-financial
    
    # 保存PM2配置
    pm2 save
    
    # 设置开机自启
    pm2 startup
    
    log_info "应用启动完成 ✓"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 等待应用启动
    sleep 5
    
    # 检查应用是否运行
    if pm2 list | grep -q "canton-financial.*online"; then
        log_info "应用运行正常 ✓"
    else
        log_error "应用启动失败，请查看日志: pm2 logs canton-financial"
        exit 1
    fi
    
    # 检查HTTP端点（假设运行在3000端口）
    if curl -f http://localhost:3000 &> /dev/null; then
        log_info "HTTP端点响应正常 ✓"
    else
        log_warn "HTTP端点无响应，请检查应用配置"
    fi
}

# 显示部署信息
show_deployment_info() {
    echo ""
    echo "=========================================="
    echo "  部署完成！"
    echo "=========================================="
    echo ""
    echo "应用名称: canton-financial"
    echo "运行状态: $(pm2 list | grep canton-financial | awk '{print $10}')"
    echo ""
    echo "常用命令："
    echo "  查看日志: pm2 logs canton-financial"
    echo "  重启应用: pm2 restart canton-financial"
    echo "  停止应用: pm2 stop canton-financial"
    echo "  查看状态: pm2 status"
    echo ""
    echo "=========================================="
}

# 主函数
main() {
    log_info "开始部署Canton Financial网站..."
    echo ""
    
    check_requirements
    check_env_vars
    install_dependencies
    run_database_migration
    build_project
    start_application
    health_check
    show_deployment_info
    
    log_info "部署流程全部完成！"
}

# 执行主函数
main
