import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Test;

public class MatrixTest {
	private Logger logger = LogManager.getLogger("MatrixTest");


	@Test
	public void test() {
		Matrix a = new Matrix(1, 1);
			for (int i = 0; i < a.row; i++) {
			for (int j = 0; j < a.column; j++) {
				a.set(i, j, Math.floor(Math.random() * 10));
			}
		}

		System.out.println(a);

		Matrix b = new Matrix(1, 1);
		for (int i = 0; i < b.row; i++) {
			for (int j = 0; j < b.column; j++) {
				b.set(i, j, Math.floor(Math.random() * 10));
			}
		}

		System.out.println(b);

		System.out.println(a.multiply(b));
	}

	class Matrix {
		private int row;
		private int column;
		private double[][] data;


		public void set(int row, int column, double value) {
			this.data[row][column] = value;
		}

		Matrix(int row, int column) {
			this.row = row;
			this.column = column;

			data = new double[row][column];
		}

		Matrix multiply(Matrix other) {
			if (this.column != other.row) {
				logger.error("错误的行列数，本对象列数：{}，计算对象行数：{}", this.column, other.row);
				return null;
			}
			Matrix result = new Matrix(this.row, other.column);

			double value;
			for (int i = 0; i < result.row; i++) {
				for (int j = 0; j < result.column; j++) {

					value = 0.0;
					for (int m = 0; m < this.column; m++) {
						value += this.data[i][m] * other.data[m][j];
					}

					result.data[i][j] = value;
				}
			}

			return result;
		}

		@Override
		public String toString() {
			StringBuilder builder = new StringBuilder();

			for (int i = 0; i < row; i++) {
				builder.append("\t");
				for (int j = 0; j < column; j++) {
					builder.append(data[i][j]).append("\t\t");
				}
				builder.append("\n");
			}

			return builder.toString();
		}
	}
}

