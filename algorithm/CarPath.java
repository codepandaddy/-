import java.util.*;

public class CarPath {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] matrix = sc.nextLine().split(",");
        int m = Integer.valueOf(matrix[0]);
        int n = Integer.valueOf(matrix[1]);
        int matrixs[][] = new int[m][n];
        int visit[][] = new int[m][n];
        Map<String, Integer> oilStations = new HashMap<>();
        for (int i = 0; i < m; i++) {
            String[] data = sc.nextLine().split(",");
            for (int j = 0; j < n; j++) {
                matrixs[i][j] = Integer.valueOf(data[j]);
                visit[i][j] = 0;
                if (matrixs[i][j] == -1) {
                    oilStations.put(String.valueOf(i) + String.valueOf(j), Integer.MAX_VALUE);
                }
            }
        }

        int startX = 0;
        int startY = 0;
        int endX = m - 1;
        int endY = n - 1;
        Path startPath = new Path(startX, startY, matrixs[0][0], 100 - matrixs[0][0]);
        startPath.originalOil = 100;
        visit[0][0] = 1;
        Queue<Path> queue = new LinkedList<>();
        queue.offer(startPath);

        List<Integer> needOil = new ArrayList<>();
        boolean hasRoote = false;

        int dirctions[][] = {{-1, 0}, {0, -1}, {1, 0}, {0, 1}};

        // BFS
        while (!queue.isEmpty()) {
            Path frontPath = ((LinkedList<Path>) queue).getFirst();
            if (frontPath.x == endX && frontPath.y == endY) {
                hasRoote = true;
                ((LinkedList<Path>) queue).pollFirst();
                continue;
            }

            for (int i = 0; i < 4; i++) {
                int newX = frontPath.x + dirctions[i][0];
                int newY = frontPath.y + dirctions[i][1];

                if (newX >= 0 && newX < m && newY >= 0 && newY < n) {
                    System.out.println("newX " + newX + " newY " + newY);
                    if (newX == 3 && newY == 3) {
                        System.out.println("error0");
                    }
                    if (newX == endX && newY == endY) { // 下一个是终点
                        Path endPath = new Path(newX, endY, matrixs[newX][newX], frontPath.getRestOil() - matrixs[newX][newX]);
                        if (endPath.restOil < 0) { // 油不足以走到终点
                            continue;
                        } else {
                            if (frontPath.hasAddOil) { //加过油
                                endPath.originalOil = frontPath.originalOil;
                            } else {//全程没有加过油 并且有多的油
                                endPath.originalOil = frontPath.originalOil - endPath.restOil;
                            }
                            needOil.add(endPath.originalOil);
                            hasRoote = true;
                            queue.offer(endPath);
                            continue;
                        }
                    }

                    if (matrixs[newX][newY] != 0 && matrixs[newX][newY] != -1 && visit[newX][newY] == 0) { //下一个是一般道路
                        Path nextPath = new Path(newX, newY, matrixs[newX][newY],
                                frontPath.getRestOil() - matrixs[newX][newY]);
                        if (nextPath.restOil < 0) { // 油不足以走到终点
                            continue;
                        } else {
                            nextPath.hasAddOil = frontPath.hasAddOil;
                            if (frontPath.hasAddOil) {//加过油
                                nextPath.originalOil = frontPath.originalOil;
                            } else { //没加过油 需要的油就要加上当前道路需要的油
                                nextPath.originalOil = frontPath.originalOil;
                            }
                        }
                        if (nextPath.x == 3 && nextPath.y == 3) {
                            System.out.println("error");
                        }
                        queue.offer(nextPath);
                        visit[newX][newY] = 1;
                        continue;
                    }

                    if (matrixs[newX][newY] == 0) {
                        visit[newX][newY] = 1;
                        continue;
                    }
                    if (matrixs[newX][newY] == -1 && visit[newX][newY] == 0) { // 到加油站了，这个题明显到加油站都得加满油
                        Integer prsentLeastOil = oilStations.get(String.valueOf(newX) + String.valueOf(newY));
                        if (frontPath.restOil >= prsentLeastOil) {
                            continue;
                        }
                        oilStations.put(String.valueOf(newX) + String.valueOf(newY), frontPath.restOil);
                        Path nextPath = new Path(newX, newY, matrixs[newX][newY],
                                100);// 加油站直接加满油
                        nextPath.hasAddOil = true;
                        if (!frontPath.hasAddOil) {// 前面没有加过油
                            nextPath.originalOil = frontPath.originalOil - frontPath.restOil;// 需要的油应该是前车需要的油料减去前车剩余油料，因为初始化是100
                        } else { // 前面已经加过油
                            nextPath.originalOil = frontPath.originalOil;
                        }
                        visit[newX][newY] = 0;  //加油站不设置访问标记 通过判断到加油站剩余油料是最少得来判断是否将当前数据加入队列，继续扫描
                        if (nextPath.x == 3 && nextPath.y == 3) {
                            System.out.println("error1");
                        }
                        queue.offer(nextPath);
                        continue;
                    }
                }
            }

            ((LinkedList<Path>) queue).pollFirst(); //首元素推出队列
        }

        if (hasRoote) {
            Collections.sort(needOil);
            System.out.println(needOil.get(0));
        } else {
            System.out.println(-1);
        }


    }

    private static class Path {
        int x;
        int y;
        int needOil;
        int restOil;
        int originalOil;
        boolean hasAddOil;//是否加过油

        public Path(int x, int y, int needOil) {
            this.x = x;
            this.y = y;
            this.needOil = needOil;
        }

        public Path(int x, int y, int needOil, int restOil) {
            this.x = x;
            this.y = y;
            this.needOil = needOil;
            this.restOil = restOil;
        }


        public int getX() {
            return x;
        }

        public void setX(int x) {
            this.x = x;
        }

        public int getY() {
            return y;
        }

        public void setY(int y) {
            this.y = y;
        }

        public int getNeedOil() {
            return needOil;
        }

        public void setNeedOil(int needOil) {
            this.needOil = needOil;
        }

        public int getRestOil() {
            return restOil;
        }

        public void setRestOil(int restOil) {
            this.restOil = restOil;
        }

        public Path(int originalOil) {
            this.originalOil = originalOil;
        }

        public Path(boolean hasAddOil) {
            this.hasAddOil = hasAddOil;
        }
    }
}