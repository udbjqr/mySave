package com.tk.common.util;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * 导入Excel文件（支持“XLS”和“XLSX”格式）
 *
 * @author yishion
 */
public class ImportExcel {

	private static Logger log = LogManager.getLogger(ImportExcel.class.getName());

	/**
	 * 工作薄对象
	 */
	private Workbook wb;

	/**
	 * 工作表对象
	 */
	private Sheet sheet;

	/**
	 * 标题行号
	 */
	private int headerNum;

	/**
	 * 构造函数
	 * <p>
	 * 导入文件，读取第一个工作表
	 *
	 * @param headerNum 标题行号，数据行号=标题行号+1
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public ImportExcel(String fileName, int headerNum)
					throws InvalidFormatException, IOException {
		this(new File(fileName), headerNum);
	}

	/**
	 * 构造函数
	 * <p>
	 * 导入文件对象，读取第一个工作表
	 *
	 * @param headerNum 标题行号，数据行号=标题行号+1
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public ImportExcel(File file, int headerNum) throws InvalidFormatException,
					IOException {
		this(file, headerNum, 0);
	}

	/**
	 * 构造函数
	 * <p>
	 * 导入文件
	 *
	 * @param headerNum  标题行号，数据行号=标题行号+1
	 * @param sheetIndex 工作表编号
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public ImportExcel(String fileName, int headerNum, int sheetIndex)
					throws InvalidFormatException, IOException {
		this(new File(fileName), headerNum, sheetIndex);
	}

	/**
	 * 构造函数
	 * <p>
	 * 导入文件对象
	 *
	 * @param headerNum  标题行号，数据行号=标题行号+1
	 * @param sheetIndex 工作表编号
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public ImportExcel(File file, int headerNum, int sheetIndex)
					throws InvalidFormatException, IOException {
		this(file.getName(), new FileInputStream(file), headerNum, sheetIndex);
	}



	/**
	 * 构造函数
	 *
	 * @param headerNum  标题行号，数据行号=标题行号+1
	 * @param sheetIndex 工作表编号
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public ImportExcel(String fileName, InputStream is, int headerNum,
	                   int sheetIndex) throws InvalidFormatException, IOException {
		if (StringUtils.isBlank(fileName)) {
			throw new RuntimeException("导入文档为空!");
		} else if (fileName.toLowerCase().endsWith("xls")) {
			this.wb = new HSSFWorkbook(is);
		} else if (fileName.toLowerCase().endsWith("xlsx")) {
			this.wb = new XSSFWorkbook(is);
		} else {
			throw new RuntimeException("文档格式不正确!");
		}
		if (this.wb.getNumberOfSheets() < sheetIndex) {
			throw new RuntimeException("文档中没有工作表!");
		}
		this.sheet = this.wb.getSheetAt(sheetIndex);
		this.headerNum = headerNum;
		log.debug("Initialize success.");
	}

	/**
	 * 获取行对象
	 *
	 * @param rownum
	 * @return
	 */
	public Row getRow(int rownum) {
		return this.sheet.getRow(rownum);
	}

	/**
	 * 获取数据行号
	 *
	 * @return
	 */
	public int getDataRowNum() {
		return headerNum + 1;
	}

	/**
	 * 获取最后一个数据行号
	 *
	 * @return
	 */
	public int getLastDataRowNum() {
		return this.sheet.getLastRowNum() + headerNum;
	}

	/**
	 * 获取最后一个列号
	 *
	 * @return
	 */
	public int getLastCellNum() {
		return this.getRow(headerNum).getLastCellNum();
	}

	/**
	 * 获取标题行
	 *
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public List<Object> getHeader() {
		List<Object> list = Lists.newArrayList();
		Row row = this.getRow(headerNum);
		for (int i = 0; i < getLastCellNum(); i++) {
			list.add(getCellValue(row, i));
		}
		return list;
	}

	/**
	 * 获取表格数据
	 *
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public List<Map<Object, Object>> getDataList() {
		List<Object> header = getHeader();
		List<Map<Object, Object>> list = Lists.newLinkedList();
		for (int i = getDataRowNum(); i < getLastDataRowNum() + 1; i++) {
			Row row = getRow(i);
			Map<Object, Object> map = Maps.newHashMap();
			for (int j = 0; j < getLastCellNum(); j++) {
				Object obj = getCellValue(row, j);
				map.put(header.get(j), obj);
			}
			list.add(map);
		}
		return list;
	}

	/**
	 * 获取单元格值
	 *
	 * @param row    获取的行
	 * @param column 获取单元格列号
	 * @return 单元格值
	 */
	public Object getCellValue(Row row, int column) {
		Object val = "";
		try {
			Cell cell = row.getCell(column);
			if (cell != null) {
				if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
					if (HSSFDateUtil.isCellDateFormatted(cell)) {
						val = cell.getDateCellValue();
					} else {
						val = cell.getNumericCellValue();
					}
				} else if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
					val = cell.getStringCellValue();
				} else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA) {
					val = cell.getCellFormula();
				} else if (cell.getCellType() == Cell.CELL_TYPE_BOOLEAN) {
					val = cell.getBooleanCellValue();
				} else if (cell.getCellType() == Cell.CELL_TYPE_ERROR) {
					val = cell.getErrorCellValue();
				}
			}
		} catch (Exception e) {
			return val;
		}
		return val;
	}

	// /**
	// * 导入测试
	// */
	// public static void main(String[] args) throws Throwable {
	//
	// ImportExcel ei = new ImportExcel("target/export.xlsx", 1);
	//
	// for (int i = ei.getDataRowNum(); i < ei.getLastDataRowNum(); i++) {
	// Row row = ei.getRow(i);
	// for (int j = 0; j < ei.getLastCellNum(); j++) {
	// Object val = ei.getCellValue(row, j);
	// System.out.print(val+", ");
	// }
	// System.out.print("\n");
	// }
	//
	// }

}
